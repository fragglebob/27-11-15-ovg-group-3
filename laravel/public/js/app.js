$(document).foundation();

$(document).ready(function() {
	firstFetch();
});

var lastID = false;
var twtterString = "";
var locString = "";

function firstFetch() {
	$.getJSON('/api/trending/').done(function(data) {
		var pos = data.positive;
		var neg = data.negative;

		for (var i = pos.length - 1; i >= 0; i--) {
			$('ul.trends.pos').prepend('<li><span class="number">'+pos[i].Size+'</span>'+pos[i].Trend+'</li>'); 
		}

		for (var i = neg.length - 1; i >= 0; i--) {
			$('ul.trends.neg').prepend('<li><span class="number">'+neg[i].Size+'</span>'+neg[i].Trend+'</li>'); 
		}
		
	});

	$.getJSON('/api/messages/').done(function(data) {
		for (var i = data.length - 1; i >= 0; i--) {
			$('ul.tweets').prepend(buildTweet(data[i])); 
		};

		lastID = data[0].id;

		setTimeout(addNew, 5000);
	});
}

function addNew() {
	

	$.getJSON('/api/trending/').done(function(data) {

		$("ul.trends").empty();
		var pos = data.positive;
		var neg = data.negative;

		for (var i = pos.length - 1; i >= 0; i--) {
			$('ul.trends.pos').prepend('<li><span class="number">'+pos[i].Size+'</span>'+pos[i].Trend+'</li>'); 
		}

		for (var i = neg.length - 1; i >= 0; i--) {
			$('ul.trends.neg').prepend('<li><span class="number">'+neg[i].Size+'</span>'+neg[i].Trend+'</li>'); 
		}
		
	});

	$.getJSON('/api/messages/?since_id='+lastID).done(function(data) {
		for (var i = 0 , len = data.length; i < len; i++) {
			$('ul.tweets li:last-of-type').remove();
			$('ul.tweets').prepend(buildTweet(data[i]));
			lastID = data[i].id;
		};

		setTimeout(addNew, 1000);
	});
}

function buildTweet(tweet) {
	if(tweet.Location != null) {
		locString = "<loc>" + tweet.Location + "</loc>";
	} else {
		locString = "";
	}

//Time: "2015-11-27 14:14:11",

	var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	var day = new Date();
	day = Date.parse(tweet.Time);
	var realDate = new Date(day);

	var tweetString ='<li class="tweet"><span class="username"><a href="http://www.twitter.com/'+tweet.User+'">@ '+tweet.User+'</a></span><span class="tweet-data">'+locString+'<span class="dateTime"><span class="month">'+monthNames[realDate.getMonth()]+'</span><span class="day">'+realDate.getDate()+'</span><span class="time">'+realDate.getHours()+' : '+("0"+realDate.getMinutes()).slice(-2)+'</span></span></span><span class="message">'+tweet.Text+'</span>';
	   
	if(tweet.Tone > 0) {
		tweetString = tweetString+'<span class="tone tone-good">good</span></li>';
	} else if(tweet.Tone < 0) {
		tweetString = tweetString+'<span class="tone tone-bad">bad</span></li>';
	} else {
		tweetString = tweetString+'<span class="tone tone-neutral">neutral</span></li>';
	}

	return tweetString;
}