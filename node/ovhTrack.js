var Twitter = require('twitter');
var http = require('http');
var mysql = require('mysql');
var sentiment = require('sentiment');
var consumer_key = "j22ImSSl5UX0uocLVMeDA", // API key
 consumer_secret = "R8lfNWlGxzwhWEbbcoGqJfyTa7v7VezZZtl7Ks", // API secret
 access_token = "1957461038-OmPdXkTLJ1C4xk2asA0faG2DRZtmA1WRGMOEwge",
 access_token_secret = "wpBPEKkinHkVFxxOfrZT3E62mzErQeJcnVw9kCUrcliAk";
var frequencyObj = {};
var redis = require("redis"), redisClient = redis.createClient({
    host: "vps98649.ovh.net"
});

var client = new Twitter({
  consumer_key: consumer_key,
  consumer_secret: consumer_secret,
  access_token_key: access_token,
  access_token_secret: access_token_secret
});

client.stream('statuses/filter', {track: 'server'}, function(stream) {
  stream.on('data', function(tweet) {
    insertTweetToMysql(tweet);
  });
 
  stream.on('error', function(error) {
//    throw error;
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
    var sentimentResult = sentiment(tweet.text);
    sortIndividualMessage(tweet.text, sentimentResult);
    var allValues = {
        Source: "Twitter",
        Text: tweet.text,
        Tone: sentimentResult.score,
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

function sortIndividualMessage(text, sentScore) {
    var res = text.toLowerCase().split(" ");
    for (var i=0; i< res.length; res++) {
        if(res[i] !== "rt") {
            if(sentScore.score > 0) {
                redisClient.incr('words-pos-' + res[i]);
                redisClient.expire('words-pos-' + res[i], 3600);
            } else {
                redisClient.incr('words-neg-' + res[i]);
                redisClient.expire('words-neg-' + res[i], 3600);
            }
        }
    }
}

var trends = {
    pos: [],
    neg: []
};

function redisGetKeys()
{
    redisClient.KEYS('words-*',
        function (err, replies) {
//            console.log(replies.length + " replies:");
            
            processTrends(trends.pos, trends.neg);
        
            trends = {
                pos: [],
                neg: []
            };
        
            replies.forEach(function (reply, i) {
                
                redisClient.get(reply, function(err, replyFromRedis) {
                    
                    
                    if (replyFromRedis != null) {
                        if(reply.indexOf('words-pos-') > -1) {
                            
                            trends.pos.push({word: reply.replace('words-pos-', ''), count: replyFromRedis });
                        } else if (reply.indexOf('words-neg-') > -1) {
                            trends.neg.push({word: reply.replace('words-neg-', ''), count: replyFromRedis });
                        }
                    }
                });
            });
            
            setTimeout(redisGetKeys, 5000);
        }
    );
}

setTimeout(redisGetKeys, 5000);


function processTrends(pos, neg) {
    pos.sort(function(a, b) {
        return b.count - a.count;
    });
    
    neg.sort(function(a, b) {
        return b.count - a.count;
    });
    
    console.log("pos");
    console.log(pos);
    console.log("neg");
    console.log(neg);
        
    for(var i = 0; i < neg.length; i++) {
        if(neg[i].count >= 5 && i < 10) {
            storeTrendingWord(neg[i], false);
        }
    }
    for(var i = 0; i < pos.length; i++) {
        if(pos[i].count >= 5 && i < 10) {
            storeTrendingWord(pos[i], true);
        }
    } 
}

function storeTrendingWord(tonedWord, positive) {
    console.log("tonedWord.word");
    console.log(tonedWord.word);
    var toneVar = (positive ? 1: -1);
    var newDate = new Date();
    var allValues = {
        Trend: tonedWord.word,
        Tone: toneVar,
        Time: newDate.toISOString(),
        Ongoing: true,
        Size: tonedWord.count
    };
//    var littleValues = {
//        Trend: tonedWord.word,
//        Ongoing: true
//    };
    var mysqlQuery = 'SELECT * FROM Trending WHERE Trend = ? AND Ongoing = 1';
    var originalSql = connection.query(mysqlQuery, tonedWord.word, function(errOne, results) {
      if (errOne) {
          console.log("It was errone");
          console.log(errOne);
      } else {
//          console.log("found rows");
//          console.log(results);
          if(results.length > 0) {
//              var mysqlQuery = 'UPDATE Trending SET Size = :size WHERE Trend = :trend';
              var mysqlQuery = 'UPDATE Trending SET Size = ? WHERE Trend = ?';
              if (parseInt(allValues.Size) !== parseInt(results[0].Size)) {
                    var sqlll = connection.query(mysqlQuery, [parseInt(allValues.Size), tonedWord.word], function(err, result) {
                      if (err) {
                          console.log("It was err 2");
                          console.log(err);
                      } else {
                          sendPushnotif();
                          console.log("Updated trend!");
                      }
                    });
                  console.log(sqlll.sql);
              }
          } else {
                var mysqlQuery = 'INSERT INTO Trending SET ?';
                var otherSql = connection.query(mysqlQuery, allValues, function(err, rows, fields) {
                  if (err) {
                      console.log("It was err 3");
                      console.log(err);
                  } else {
                      sendPushnotif();
                      console.log("Inserted trend!");
                  }
                });
              console.log(otherSql.sql);
          }
      }
    });
    console.log(originalSql.sql);
}



function sendPushnotif() {
    getRegIds(function(ids){
                           
        var dataGCM = {
          "collapseKey":"applice",
          "delayWhileIdle":true,
          "timeToLive":3,
          "data":{
            "message":"My message","title":"My Title"
            },
          "registration_ids": ids
        };

        var dataString =  JSON.stringify(dataGCM);
        var headers = {
          'Authorization' : 'key=AIzaSyCO14rpRsoP3y3NnJI684WpIt7xB3ibXQ4',
          'Content-Type' : 'application/json',
          'Content-Length' : dataString.length
        };

        var options = {
          host: 'android.googleapis.com',
          path: '/gcm/send',
          method: 'POST',
          headers: headers
        };

        //Setup the request 
        var req = http.request(options, function(res) {


          res.setEncoding('utf-8');

          var responseString = '';

          res.on('data', function(data) {
              console.log("data responseeeeeeeeee");
              console.log(data);
              if(data.STATUS) {
                  console.log("data.STATUS");
                  console.log(data.STATUS);
              }
            responseString += data;
          });

          res.on('end', function() {
            var resultObject = JSON.parse(responseString);
        //    print(responseString);
            console.log(resultObject);
          });
          console.log('STATUS: ' + res.statusCode);
          console.log('HEADERS: ' + JSON.stringify(res.headers));

        });

        req.on('error', function(e) {
          // TODO: handle error.
          console.log('error : ' + e.message + e.code);
        });

        req.write(dataString);
        req.end();
    });
}

function getRegIds(callback) {
    var returnResults = [];
    var mysqlQuery = 'SELECT * FROM Registrations';
    var originalSql = connection.query(mysqlQuery, function(errOne, results) {
      if (errOne) {
          console.log("It was errone");
          console.log(errOne);
      } else {
          if(results.length > 0) {
              for(var i = 0; i < results.length; i++) {
                  returnResults.push(results[i].Registration.replace('https://android.googleapis.com/gcm/send/', ''));
                  
              }
          }
      }
        callback(returnResults);
    });
}