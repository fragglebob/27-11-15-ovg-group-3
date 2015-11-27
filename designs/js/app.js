$(document).foundation();

$(document).ready(function() {
	firstFetch();
});

var lastID = false;
var twtterString = "";
var locString = "";

function firstFetch() {
	$.getJSON('http://vps98649.ovh.net/api/trending/').done(function(data) {
		var pos = data.positive;
		var neg = data.negative;

		for (var i = pos.length - 1; i >= 0; i--) {
			$('ul.trends.pos').prepend('<li><span class="number">'+pos[i].Size+'</span>'+pos[i].Trend+'</li>'); 
		}

		for (var i = neg.length - 1; i >= 0; i--) {
			$('ul.trends.neg').prepend('<li><span class="number">'+neg[i].Size+'</span>'+neg[i].Trend+'</li>'); 
		}
		
	});

	$.getJSON('http://vps98649.ovh.net/api/messages/').done(function(data) {
		for (var i = data.length - 1; i >= 0; i--) {
			$('ul.tweets').prepend(buildTweet(data[i])); 
		};

		lastID = data[0].id;

		setTimeout(addNew, 5000);
	});
}

function addNew() {
	

	$.getJSON('http://vps98649.ovh.net/api/trending/').done(function(data) {

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

	$.getJSON('http://vps98649.ovh.net/api/messages/?since_id='+lastID).done(function(data) {
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

var isPushEnabled = false;

window.addEventListener('load', function() {  
  var pushButton = document.querySelector('.js-push-button');  
  pushButton.addEventListener('click', function() {  
    if (isPushEnabled) {  
      unsubscribe();  
    } else {  
      subscribe();  
    }  
  });

  // Check that service workers are supported, if so, progressively  
  // enhance and add push messaging support, otherwise continue without it.  
  if ('serviceWorker' in navigator) {  
    navigator.serviceWorker.register('/service-worker.js')  
    .then(initialiseState);  
  } else {  
    console.warn('Service workers aren\'t supported in this browser.');  
  } 
});

// Once the service worker is registered set the initial state  
function initialiseState() {  
  // Are Notifications supported in the service worker?  
  if (!('showNotification' in ServiceWorkerRegistration.prototype)) {  
    console.warn('Notifications aren\'t supported.');  
    return;  
  }

  // Check the current Notification permission.  
  // If its denied, it's a permanent block until the  
  // user changes the permission  
  if (Notification.permission === 'denied') {  
    console.warn('The user has blocked notifications.');  
    return;  
  }

  // Check if push messaging is supported  
  if (!('PushManager' in window)) {  
    console.warn('Push messaging isn\'t supported.');  
    return;  
  }

  // We need the service worker registration to check for a subscription  
  navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {  
    // Do we already have a push message subscription?  
    serviceWorkerRegistration.pushManager.getSubscription()  
      .then(function(subscription) {  
        // Enable any UI which subscribes / unsubscribes from  
        // push messages.  
        var pushButton = document.querySelector('.js-push-button');  
        pushButton.disabled = false;

        if (!subscription) {  
          // We aren't subscribed to push, so set UI  
          // to allow the user to enable push  
          return;  
        }

        // Keep your server in sync with the latest subscriptionId
        sendSubscriptionToServer(subscription);

        // Set your UI to show they have subscribed for  
        // push messages  
        pushButton.textContent = 'Disable Push Messages';  
        isPushEnabled = true;  
      })  
      .catch(function(err) {  
        console.warn('Error during getSubscription()', err);  
      });  
  });  
}