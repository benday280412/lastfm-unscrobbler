var settings = {};

settings.apiBaseUrl = "http://ws.audioscrobbler.com/2.0/";
settings.loginUrl = "https://secure.last.fm/login";
settings.unscrobbleUrl = "http://www.last.fm/user/{USERNAME}/unscrobble"
settings.libraryUrl = "http://www.last.fm/user/{USERNAME}/library";


settings.userGetRecentTrackLimit = "200";

settings.apiKey = "";
settings.userGetRecentTrackPages = "10";
settings.username = "";
settings.password = "";
settings.artistNames = [];

module.exports = settings;