<!doctype html>
<html class="no-js" lang="en">
<head>
    <meta charset="utf-8" />
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>OVH Social Media tracker</title>
    <link rel="stylesheet" href="css/foundation.css" />
    <link rel="stylesheet" href="css/app.css" />
    <link rel="stylesheet" href="css/flag-icon.min.css" />

    <link rel="manifest" href="/manifest.json">
</head>
<body>

<div class="container">
    <div class="row">
        <div class="large-12 columns">
            <h1>OVH Social Media Tracker</h1>
        </div>
    </div>

    <div class="row">
        <div class="small-12 medium-7 large-8 columns">
            <!-- <h2>Active Notifications</h2>
            <ul class="notifications">
              <li class="notification">
                <span class="title">Title</span>
                <span class="information">Something then goes in here</span>
                <span class="startTime">1448624151</span>
              </li>
            </ul> -->
            <h3>Latest Posts</h3>
            <ul class="tweets">

            </ul>
            <!-- <p class="right"><a href="javascript:void();">View history</a></p> -->
        </div>
        <div class="small-12 medium-5 large-4 columns">
            <h4>Positive Trends</h4>
            <ul class="trends pos">

            </ul>
            <h4>Negative Trends</h4>
            <ul class="trends neg">

            </ul>
            <button class="js-push-button">Enable Push Notifications</button>
            <!-- <p><a href="javascript:void();">View History</a></p> -->
        </div>
    </div>
</div>

<script src="js/vendor/jquery.min.js"></script>
<script src="js/vendor/what-input.min.js"></script>
<script src="js/foundation.min.js"></script>
<script src="js/app.js"></script>
<script src="js/serviceWorker.js"></script>
</body>
</html>
