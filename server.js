import Crawler from 'crawler';
import { findChildLinks, plotStats } from './utils/helper.js';
import { dbMethods } from './utils/db.js';
import { BASE_URL, MONGO_URI } from './utils/constants.js';
import { MongoClient } from 'mongodb';
import * as cheerio from 'cheerio';
import fs from 'fs';

const linksCrawledPlot = [
    {
        x: [],
        y: [],
        type: 'scatter',
    },
];

const keywordPlot = [
    {
        x: [],
        y: [],
        type: 'scatter',
    },
];

const linksExtractedPlot = [
    {
        x: [],
        y: [],
        type: 'scatter',
    },
];

const main = async () => {
    // Connect to DB
    const client = new MongoClient(MONGO_URI);
    await dbMethods.connectDB(client);

    try {
        const visitedUrls = new Set();
        const extractedUrls = [];
        visitedUrls.add(BASE_URL);
        visitedUrls.add(`${BASE_URL}/`)
        let count = 0;
        const startTimeStamp = Date.now();
        let lastTimeStamp = startTimeStamp;
        let totalWords = 0;

        const crawler = new Crawler({
            maxConnections: 1,
            timeout: 5000,
            callback: async function (error, res, done) {
                if (error) {
                    console.log(error);
                } else if (count < 1000) {
                    const body = res.body;
                    const url = res.options.url;
                    const $ = cheerio.load(body);

                    // Add new links to queue
                    for (const link of findChildLinks(url, $)) {
                        extractedUrls.push(link)
                        if (!visitedUrls.has(link)) {
                            crawler.add(link);
                            visitedUrls.add(link);
                        }
                    }

                    // Remove iframe content
                    $('iframe').remove();

                    // Title and content
                    const titleText = $('title').text();
                    const paragraphText = $('p').text();

                    try {
                        const timeTaken = Date.now() - lastTimeStamp;
                        lastTimeStamp = Date.now();
                        totalWords += paragraphText.length;

                        await dbMethods.insertData(client, {
                            url,
                            title: titleText,
                            content: paragraphText,
                            timestamp: Date.now(),
                            timeTaken,
                        });

                        // Update keywordPlot
                        keywordPlot[0].x.push((lastTimeStamp - startTimeStamp)); // Time elapsed in seconds
                        keywordPlot[0].y.push(totalWords);

                        linksCrawledPlot[0].x.push((lastTimeStamp - startTimeStamp)); // Time elapsed in seconds
                        linksCrawledPlot[0].y.push(visitedUrls.size);

                        linksExtractedPlot[0].x.push((lastTimeStamp - startTimeStamp)); // Time elapsed in seconds
                        linksExtractedPlot[0].y.push(extractedUrls.length);

                        count += 1;
                        if (count === 1000) {
                            const totalTime = Date.now() - startTimeStamp;
                            console.log(`Total time: ${totalTime}ms`);
                            console.log(`Num of URLs crawled: ${count}`);
                            console.log(`Num of URLs extracted: ${visitedUrls.size}`);
                            console.log(`Crawl speed: ${count / (totalTime / (1000 * 60))} URLs per minute`);

                            // Save plot data
                            fs.writeFileSync('keyword.json', JSON.stringify(keywordPlot[0]));
                            fs.writeFileSync('extracted_links.json', JSON.stringify(linksExtractedPlot[0]))
                            fs.writeFileSync('crawled_links.json', JSON.stringify(linksCrawledPlot[0]))
                            plotStats();
                            return;
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }
                done();
            },
        });

        crawler.on('drain', () => {
            console.log('Crawler drained.');
            client.close();
        });

        // Start crawling
        crawler.add(BASE_URL);
    } catch (error) {
        console.error(error);
    }
};

main();
