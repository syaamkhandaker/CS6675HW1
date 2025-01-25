import { BASE_DOMAIN } from './constants.js';
import fs from 'fs';
import plot from 'nodeplotlib'

export const findChildLinks = (url, $) => {
    const links = [];

    // jquery to find links with valid href tags
    $('a').filter((i, el) => {
        const href = $(el).attr('href');
        if (href && href.startsWith('/')) {
            const newLink = new URL(href, url).href;
            links.push(newLink);
        }
        else if (href && href.includes('http') && href.includes(BASE_DOMAIN)) {
            links.push(href);
        }
    });
    
    return links;
}

export const plotStats = () => {
    plot.plot([JSON.parse(fs.readFileSync('keyword.json'))], {'xaxis.title': 'Time (ms)', 'yaxis.title': "Number of Keywords"})
    plot.plot([JSON.parse(fs.readFileSync('extracted_links.json'))], {'xaxis.title': 'Time (ms)', 'yaxis.title': "Number of Extracted Links"})
    plot.plot([JSON.parse(fs.readFileSync('crawled_links.json'))], {'xaxis.title': 'Time (ms)', 'yaxis.title': "Number of Crawled Links"})
}