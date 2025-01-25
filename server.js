import Crawler from 'crawler'; 
import { findChildLinks } from './utils/helper.js';
import { dbMethods } from './utils/db.js';
import { BASE_URL, MONGO_URI } from './utils/constants.js';
import { MongoClient } from 'mongodb';
import * as cheerio from 'cheerio';


const main = async () => {
    // Connect to DB
    const client = new MongoClient(MONGO_URI);
    await dbMethods.connectDB(client);


    try {
        const visitedUrls = new Set();
        visitedUrls.add(BASE_URL);
        var count = 0;
        var startTimeStamp = Date.now();
        var lastTimeStamp = Date.now();

        const crawler = new Crawler({
            maxConnections: 10,
            timeout: 5000,
            callback: async function (error, res, done) {
                if (error) {
                    console.log(error)
                } else {
                    if (count < 1000) {
                        const body = res.body;
                        const url = res.options.url;
                        const $ = cheerio.load(body);                    

                        // add new links to queue
                        for (let link of findChildLinks(url, $)) {
                            if (count < 1000 && !visitedUrls.has(link)) {
                                crawler.add(link)
                                visitedUrls.add(link);
                            }
                        }
                        // find subject of content
                        $('iframe').remove();
                        const titleText = $('title').text();
                        const paragraphText = $('p').text();

                        try {
                            const time = Date.now() - lastTimeStamp;
                            lastTimeStamp = Date.now();
                            console.log(`Added the link, ${url} in ${time}ms`)
                            await dbMethods.insertData(client, { url, title: titleText, content: paragraphText, timestamp: Date.now(), timeTaken: time });
                            count += 1
                            if (count === 1000) {
                                crawler.emit('drain')
                                console.log(`Took total time of ${Date.now() - startTimeStamp}ms`)
                                return;
                            }
                        } catch (error) {
                            console.log(error)
                        }
                    }
                }
                done();
            }
        });

        crawler.on("drain", () => {
            client.close();
        });


        crawler.add(BASE_URL)

    } catch (error) {
        console.error(error);
    }
};

main();
