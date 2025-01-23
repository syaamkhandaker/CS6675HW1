const crawler = require('crawler');

const c = new crawler({
    maxConnections: 10,
    preRequest: function (url, callback) {
        console.log(url);
        callback();
    },
    callback: function (error, res, done) {
        if (error) {
            console.log(error);
        } else {
            console.log(res.body);
        }
        done();
    }
});

c.queue('https://cc.gatech.edu');
