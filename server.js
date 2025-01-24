import Crawler from 'crawler'; 
import { findChildLinks } from './utils/helper.js';
import { dbMethods } from './db.js';
import { MONGO_URI } from './utils/constants.js';
import { MongoClient } from 'mongodb';
import nlp from 'compromise';
import * as cheerio from 'cheerio';


const main = async () => {
    // Connect to DB
    const client = new MongoClient(MONGO_URI);
    await dbMethods.connectDB(client);

    const closeServer = async () => {
        await client.close()
    }

    try {
        const visitedUrls = new Set();
        visitedUrls.add('https://cc.gatech.edu');
        var count = 1;

        const crawler = new Crawler({
            maxConnections: 10,
            retries: 0,
            callback: async function (error, res, done) {
                if (error) {
                    console.log(error)
                } else {
                    const body = res.body;
                    const $ = res.$;
                    if (!$) {
                        return
                    }

                    // add new links to queue
                    for (let link of findChildLinks(body)) {
                        if (count < 1000 && !visitedUrls.has(link)) {
                            console.log('Adding the link to queue: ', link)
                            crawler.add(link)
                            visitedUrls.add(link);
                        }
                    }

                   console.log(count)

                    // find subject of content
                    $('iframe').remove();
                    const titleText = $('title').text();
                    const paragraphText = $('p').text();

                    console.log('Title:', titleText);
                    console.log('Paragraphs:', paragraphText);

                    try {
                        console.log("Adding the follow link to db")
                        await dbMethods.insertData(client, { url: res.options.url, title: titleText, content: paragraphText, timestamp: Date.now() });
                        count += 1
                    } catch (error) {
                        console.log(error)
                    }
                }
                done();
            }
        });


        crawler.add('https://cc.gatech.edu')

    } catch (error) {
        console.error(error);

    }
};

main();
