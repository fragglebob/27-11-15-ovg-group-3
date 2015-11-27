var Twitter = require('twitter');
var mysql = require('mysql');
var consumer_key = "j22ImSSl5UX0uocLVMeDA", // API key
 consumer_secret = "R8lfNWlGxzwhWEbbcoGqJfyTa7v7VezZZtl7Ks", // API secret
 access_token = "1957461038-OmPdXkTLJ1C4xk2asA0faG2DRZtmA1WRGMOEwge",
 access_token_secret = "wpBPEKkinHkVFxxOfrZT3E62mzErQeJcnVw9kCUrcliAk";

var client = new Twitter({
  consumer_key: consumer_key,
  consumer_secret: consumer_secret,
  access_token_key: access_token,
  access_token_secret: access_token_secret
});

client.stream('statuses/filter', {track: 'ovh'}, function(stream) {
  stream.on('data', function(tweet) {
    insertTweetToMysql(tweet);
  });
 
  stream.on('error', function(error) {
    throw error;
  });
});

var connection = mysql.createConnection({
  host     : '92.222.16.91',
  user     : 'yellow',
  password : 'room',
  database : 'scarred'
});
connection.connect();

function insertTweetToMysql(tweet) {
    var customDateUnix = Date.parse(tweet.created_at);
    var customDate = new Date(customDateUnix);
    var allValues = {
        Source: "Twitter",
        Text: tweet.text,
        Tone: 1,
        User: tweet.user.screen_name,
        Time: customDate.toISOString(),
        Location: tweet.location,
        Services: "whatEverService"
    };
    var mysqlQuery = 'INSERT INTO Message SET ?';
    connection.query(mysqlQuery, allValues, function(err, rows, fields) {
      if (err) {
          console.log(err);
      } else {
          console.log("Inserted tweet");
      }
    });
}

function isInt(n) {
   return n % 1 === 0;
}