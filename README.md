# Problem Selection:

I did Problem 1.2 of trying to build a web crawler of my own.

## Code Implementation:
I implemented my web crawler by using the Crawler NPM module and Cheerio to parse through the HTML. The base URL used was 'https://catalog.gatech.edu'.

The way my code worked was it started at the base url and did a BFS graph traversal of all href links within the parent page. There was a visited set in order to ensure duplicate links weren't traversed multiple times. The traversal also ensured that it would move only amongst the base url ('catalog.gatech.edu'). Within each link, I used cheerio to retrieve all relevant content and the title of the page. The content was associated with all the paragraph tag text within the HTML page and the title was the title tag within the page. This content and title was added as part of my MongoDB index store. 

## Web Archive:

The database store is separated into five parts: URL, Title, Content, Timestamp, timeTaken.

````
URL - the url of the website accessed
Title - the title of the website accessed
Content - The relevant content within the page
Timestamp (ms) - The epoch time of access
Time Taken (ms) - How long it took to retrieve content for that page after enqueuing it
````

An example of what would be stored in MongoDB is the following: 
![Example Mongo Store](https://github.com/user-attachments/assets/c527318e-1743-4252-a6fb-f215d0c5cd14)

## Crawl Statistics

Number of Keywords vs Time (ms):

![KeywordsVsTime](https://github.com/user-attachments/assets/ce811d9a-84b0-490e-94ee-5ff4902f2163)

Number of Extracted URLs vs Time (ms):

![ExtractedLinksVsTime](https://github.com/user-attachments/assets/94eed071-549e-4da0-8a64-ecec01b4c74c)

Number of Crawled URLs vs Time (ms):

![CrawledLinksVsTime](https://github.com/user-attachments/assets/142827d5-197e-485d-8a49-06c155493975)

## How to run: 
You can run the following code by simply running the command 'node server.js'. Once you run the command, the MongoDB store will populate with entries until the threshold of 1000 is met. Once there are 1000 entries in the database, a resulting output will show key metrics for how long the operation took, the crawl speed, etc.

### Notes: 
Ensure that node >= 20.x.x and that MongoDB store is made and updated within utils/constants.js. Any value within utils/constants.js can be adjusted to your needs and purpose and will be propagated between all elements.

### Sample Outputs: 
````
Total time: 315617ms
Num of URLs crawled: 1000
Num of URLs extracted: 6357
Crawl speed: 190.10382837426374 URLs per minute
````

## Discuss the design of your crawler: Pros and cons.

### Pros:
- Multiple Connections: Using the Crawler dependency, there's options to introduce more maximum connections, allowing web crawling to happen much quicker. In my current setup, the number of maximum parallel connections is set to 1. However, being given the option to increase it as we want, allows us to make it extremely quick to crawl websites.
- Database Scalability: Using MongoDB as our store, we can take advantage of their pre-existing solutions for scalability and holding tons of information.

### Cons:
- Rate limiting issues: Accessing certain websites a lot of times may lead to rate limiting issues of not being able to return us content as swiftly. In addition, accessing a lot of websites and web crawling may deal to bans due to the high load on a entities website.
- Single-threaded nature: By using NodeJS, we restrict ourselves to a single threaded environment. Due to this, we can't take advantage of multi-threading when crawling websites.
- Website overhead: In scenarios where websites don't exist or if it requires retries, it increases the overhead of the crawling. Given a maximum timeout value of 5000ms, we'd need to wait 5ms before we're able to retry a request. This increases the total time it requires to web crawl.

## 4. Experience and Lessons Learned

I really enjoyed the experience of making my own web crawler mainly because this is something I haven't done before. I've done similar things such as using Selenium to automate web scraping, however, I've never gotten a chance to web crawl. Given my background is in a lot of full stack development, it was also super nice to get a change and do pure NodeJS development. I also had my first introduction into JQuery and how powerful it can be. 

## Predictions
To run 10 million pages it would take approximately 10,000 * 315.6 or 3,156,000 seconds or 876.7 hours or 36.5 days.

To run 1 billion pages it would take approximately 1,000,000 * 315.6 or 315,600,000 seconds or 87666.7 hours or 3652.8 days or 10 years.

## References: 
https://github.com/syaamkhandaker/CS6675HW1
