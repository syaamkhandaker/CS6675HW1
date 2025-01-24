import Crawler from 'crawler'; 
import { findChildLinks } from './utils/helper.js';
import { dbMethods } from './db.js';
import { MONGO_URI } from './utils/constants.js';
import { MongoClient } from 'mongodb';


const main = async () => {
    // Connect to DB
    const client = new MongoClient(MONGO_URI);
    await dbMethods.connectDB(client);

    const closeServer = async () => {
        await client.close()
    }

    try {
        const queue = ['https://cc.gatech.edu'];
        const visitedUrls = new Set();
        visitedUrls.add('https://cc.gatech.edu');

        const crawler = new Crawler({
            maxConnections: 10,
            preRequest: async function (options, callback) {
                try {
                    await dbMethods.insertData(client, { url: options.uri });
                } catch (err) {
                    console.error('DB Insert Error:', err);
                }
                callback();
            },
            callback: function (error, res, done) {
                if (error) {
                    console.error(error);
                } else {
                    const body = res.body;

                    if (visitedUrls.size < 1000) {
                        let newLinks = [];
                        for (let link of findChildLinks(body)) {
                            if (!visitedUrls.has(link)) {
                                newLinks.push(link)
                                visitedUrls.add(link);
                            }
                            if (visitedUrls.size >= 1000) break;
                        }

                        newLinks = newLinks.slice(0, 1000 - visitedUrls.size);

                        newLinks.forEach(link => queue.push(link));

                        console.log(visitedUrls.size)
                        console.log('Queue Length: ', queue.length);
                        for (let link of queue) {
                            crawler.add(link)
                        }
                    } else {
                        return
                    }
                }
                done();
            }
        });

        crawler.on("drain", () => {
            client.close();
        });

        crawler.add('https://cc.gatech.edu')


    } catch (error) {
        console.error(error);
    } finally {
        // await client.close();
        console.log('Database connection closed.');
    }
};

main();
