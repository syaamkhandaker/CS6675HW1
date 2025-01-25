import { BASE_DOMAIN } from './constants.js';

export const findChildLinks = (url, $) => {
    const links = [];

    // jquery to find links with valid href tags
    $('a').filter((i, el) => {
        const href = $(el).attr('href');
        if (href && href.startsWith('/')) {
            const newLink = new URL(href, url).href
            links.push(newLink)
        }
        else if (href && href.includes('http') && href.includes(BASE_DOMAIN)) {
            links.push(href);
        }
    });
    
    return links;
}