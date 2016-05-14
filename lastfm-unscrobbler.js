#! /usr/bin/env node

var request = require("request");
var async = require("async");
var bunyan = require('bunyan');
var settings = require("./settings");
var CLIHelper = require("./CLIHelper");

require('http').globalAgent.maxSockets = 10

var jar = request.jar();
var json = {csrftoken : ""};
var log = bunyan.createLogger({name: 'server'});
var unscrobbleCount = 0;

var pagesBeingProcessed = 0;
var tracksBeingUnscrobbled = 0;

var clih = new CLIHelper(settings);

clih.processFlags();
setURLs();

async.series([
    function(callback){
    	getCSRFToken(callback);
    },
    function(callback){
        login(callback);
    },
    function(callback){
    	unscrobbleTracks(callback);
    }
]);

function getCSRFToken(callback){
    log.info("Fetching CSRF token");

    request.get(
		{
			url:settings.loginUrl,
			jar: jar
		}, 
		function(error,response,body){ 
			if (!error && response.statusCode == 200) {

				//Filter out the csrftoken cookie
				jar.getCookies(settings.loginUrl).filter(function(value){
					if(value.key === "csrftoken"){
						json.csrftoken = value.value;

						log.info("Token " + json.csrftoken);

						return true;
					}
				});
			} else {
				log.error("Could not capture csrf token");
				process.exit(1);
			}

			callback(null, "one");
		});
}

function login(callback){
    log.info("Logging in");

    request.post({
		url:settings.loginUrl, 
		jar: jar,
		headers: {
			'Referer': settings.loginUrl
		},
		form: {
			username:settings.username,
			password:settings.password,
			csrfmiddlewaretoken:json.csrftoken
		}
	}, function(error,response,body){ 
		if (!error && response.statusCode == 302) {
			//Seems Last.fm doesn't send a 401 on failure to authenticate, but provides a 302 on success
			callback(null, "two");
		} else {
			log.error("Log in failed");
			process.exit(1);
		}		
	})
}

function unscrobbleTracks(callback){
    log.info("Starting unscrobbling");
    log.info("Getting pages");

	for (i = 1; i <= settings.userGetRecentTrackPages; i++) {

		pagesBeingProcessed++;

		request.get({
			url:getUserGetRecentTracksUrl(i)
		}, 
		function(error,response,body){ 

			log.info("Called " + response.request.path);

			if (!error && response.statusCode == 200) {

				//Set the CSRF token for this request
				var cookie = request.cookie("csrftoken=" + json.csrftoken);
				jar.setCookie(cookie, settings.unscrobbleUrl);

				var result = JSON.parse(body);

				result.recenttracks.track.forEach(function(value){

					if(value.artist != null && value.name != null && value.date != null){
						var artistName = value.artist["#text"];
						var trackName = value.name;
						var date = value.date.uts;

						if(settings.artistNames.indexOf(artistName) > -1){
					        unscrobble(json.csrftoken, artistName, trackName, date);
						}
					}
				})

				pagesBeingProcessed--;

				outputUnscrobbleCount();
			}
		});
     }

	callback(null, "three");
}

function setURLs(){
	settings.unscrobbleUrl = settings.unscrobbleUrl.replace("{USERNAME}",settings.username);
	settings.libraryUrl = settings.libraryUrl.replace("{USERNAME}",settings.username);
}

function unscrobble(csrftoken, artistName, trackName, date){
	tracksBeingUnscrobbled++;

	request.post({
		url:settings.unscrobbleUrl, 
		jar: jar,
		form: {
			csrfmiddlewaretoken:csrftoken,
			artist_name:artistName,
			track_name:trackName,
			timestamp:date,
			ajax:1
		}
	}, function(error,response,body){ 
		if (!error && response.statusCode == 200) {
			log.info(artistName + ", " + trackName + ", " + date + " unscrobbled");
			unscrobbleCount++;
			tracksBeingUnscrobbled--;

			outputUnscrobbleCount();
		}
	})
}

function outputUnscrobbleCount(){
	if(pagesBeingProcessed == 0 && tracksBeingUnscrobbled == 0){
		log.info("Unscrobbled " + unscrobbleCount + " tracks");
	}
}

function getUserGetRecentTracksUrl(page){
	return settings.apiBaseUrl + "?method=user.getrecenttracks&format=json&user=" + settings.username + "&limit=" + settings.userGetRecentTrackLimit + "&page=" + page + "&api_key=" + settings.apiKey;
}