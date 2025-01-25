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
Timestamp - The Epoch time of access
Time Taken - How long it took to retrieve content for that page after enqueuing it
````

An example of what would be stored in MongoDB is the following: 
![Example Mongo Store](https://github.com/user-attachments/assets/c527318e-1743-4252-a6fb-f215d0c5cd14)

## How to run: 
You can run the following code by simply running the command 'node server.js'. Once you run the command, the MongoDB store will populate with entries until the threshold of 1000 is met. Once there are 1000 entries in the database, a resulting output will show key metrics for how long the operation took, the crawl speed, etc.

### Notes: 
Ensure that node >= 20.x.x and that MongoDB store is made and updated within utils/constants.js. Any value within utils/constants.js can be adjusted to your needs and purpose and will be propagated between all elements.

### Sample Outputs: 
````

Total time: 46296ms
Num of URLs crawled: 1000
Num of URLs extracted: 6342
Crawl speed: 1296.0082944530845
````

## Discuss the design of your crawler: Pros and cons.
Some cons of my design is how javascript is inherently single threaded.

## 4. Discuss your experience and lessons learned. Predict how long your crawler
may need to work in order to crawl 10 millions of pages and 1 billion of pages

I really enjoyed the experience of making my own web crawler mainly because this is something I haven't done before. I've done similar things such as using Selenium to automate web processes, however, I've never gotten a chance to web crawl. Given my background is in a lot of full stack development, it was also super nice to get a change and do pure NodeJS development. Through this experience, I got a chance to gain more background on web crawling and even the fallthroughts of current systems. 

## Predictions
To run 10 million pages it would take approximately 10,000 * 46.3 or 463,000 seconds or 128.6 hours or 5.4 days

To run 1 billion pages it would take approximately 1,000,000 * 46.3 or 46,300,000 seconds or 12861.1 hours or 535.9 days or 1.47 years

## References: 
https://github.com/syaamkhandaker/CS6675HW1
