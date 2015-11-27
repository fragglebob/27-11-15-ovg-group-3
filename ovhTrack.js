var Twitter = require('twitter');
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
    console.log(tweet);
    console.log(tweet.text);
  });
 
  stream.on('error', function(error) {
    throw error;
  });
});