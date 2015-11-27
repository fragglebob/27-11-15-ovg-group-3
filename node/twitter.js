var Twitter = require('twitter');
var OAuth = require('oauth').OAuth;
var consumer_key = "j22ImSSl5UX0uocLVMeDA", // API key
 consumer_secret = "R8lfNWlGxzwhWEbbcoGqJfyTa7v7VezZZtl7Ks", // API secret
 access_token = "1957461038-OmPdXkTLJ1C4xk2asA0faG2DRZtmA1WRGMOEwge",
 access_token_secret = "wpBPEKkinHkVFxxOfrZT3E62mzErQeJcnVw9kCUrcliAk";

//var client = new Twitter({
//  consumer_key: consumer_key,
//  consumer_secret: consumer_secret,
//  access_token_key: access_token,
//  access_token_secret: access_token_secret
//});
//
//client.stream('statuses/filter', {track: 'ovh'}, function(stream) {
//  stream.on('data', function(tweet) {
//    console.log(tweet.text);
//  });
// 
//  stream.on('error', function(error) {
//    throw error;
//  });
//});

var twitter_oauth = new OAuth(
	"https://api.twitter.com/oauth/request_token",
	"https://api.twitter.com/oauth/access_token", 
	consumer_key,
	consumer_secret,
	"1.0A",
	null,
	"HMAC-SHA1"
);
var keywords = "ovh&result_type=mixed";
//https://api.twitter.com/1.1/search/tweets.json?q=%23superbowl&result_type=recent
var request = twitter_oauth.get(
 "https://api.twitter.com/1.1/search/tweets.json?q=" + keywords
);

var message = "";
var newId = "";

request.on('response', function(response) {
    response.setEncoding('utf8');
    response.on('data', function(chunk) {
        message += chunk;
		 
		var newline_index= message.indexOf('\r');
		if (newline_index !== -1) {
            var tweet_payload = message.slice(0, newline_index);
            var payload = null;
            try {
                var tweet = JSON.parse(tweet_payload);
            } catch(e)
            {
                console.log("I failed on something or other");
            }
            if(tweet.text){
                console.log("@" + tweet.user.screen_name + ": " + tweet.text);
    //				insertTweet(tweet.id_str, tweet.text);
            } else if(tweet.delete) {
                //console.log(tweet);				
                // Pay attention - this could be a deletion notice
                //console.log('--- ERRORRRRRRRRRRRRRRRRRRR ---');
            };
		  message = message.slice(newline_index + 1);
        }
    });
	
	 response.on('close', function () {
		console.log('closing');
    });
	 response.on('error', function () {
        console.log('--- ERRORRRRRRRRRRRRRRRRRRR ---');
    });
	
    response.on('end', function () {
        var twitter_data = null;
        try {
            twitter_data = JSON.parse(message);
        }
        catch(e) {
            console.log("could not parse JSON", e);
        }
//        if(twitter_data)
//        {
//
//            //console.log(twitter_data['statuses'][14]);
//
//
//            //for(var i = 0; i<3; i++)
//            //{
//            //	console.log(twitter_data['statuses'][i]['user'].name + ": " + twitter_data['statuses'][i].text);
//            //}
//            //console.log("\n");
//            //console.log(twitter_data['statuses'][0].metadata);
//            //console.log(twitter_data);
//        }
//
//        newId = twitter_data['search_metadata'].max_id;
//
//        if(twitter_data)
//        {
//            for(var i = 0; i<15; i++)
//            {
//
//            }
//        }			
    });
});

request.end();