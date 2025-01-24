import * as cheerio from 'cheerio';

export const findChildLinks = (body) => {
    const links = [];

    // jquery to find links with valid href tags
    const $ = cheerio.load(body);
    $('a').filter((i, el) => {
        const href = $(el).attr('href');
        if (href && href.includes('http')) {
            links.push(href);
        }
    });
    
    return links;
}