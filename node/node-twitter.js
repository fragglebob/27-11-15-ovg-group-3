var Twitter = require('node-twitter');
var consumer_key = "j22ImSSl5UX0uocLVMeDA", // API key
 consumer_secret = "R8lfNWlGxzwhWEbbcoGqJfyTa7v7VezZZtl7Ks", // API secret
 access_token = "1957461038-OmPdXkTLJ1C4xk2asA0faG2DRZtmA1WRGMOEwge",
 access_token_secret = "wpBPEKkinHkVFxxOfrZT3E62mzErQeJcnVw9kCUrcliAk";

var twitterSearchClient = new Twitter.SearchClient(
    consumer_key,
    consumer_secret,
    access_token,
    access_token_secret
);

twitterSearchClient.search({'q': 'happy'}, function(error, result) {
    if (error)
    {
        console.log('Error: ' + (error.code ? error.code + ' ' + error.message : error.message));
    }

    if (result)
    {
        console.log(result);
    }
});