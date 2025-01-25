import * as cheerio from 'cheerio';

export const findChildLinks = (url, $) => {
    const links = [];

    // jquery to find links with valid href tags
    $('a').filter((i, el) => {
        const href = $(el).attr('href');
        console.log(href)
        if (href && href.startsWith('/')) {
            const newLink = new URL(href, url).href
            console.log(newLink)
            links.push(newLink)
        }
        else if (href && href.includes('http') && href.includes('cc.gatech.edu')) {
            links.push(href);
        }
    });
    
    return links;
}