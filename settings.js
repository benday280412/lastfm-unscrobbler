var settings = {};

settings.apiBaseUrl = "http://ws.audioscrobbler.com/2.0/";
settings.loginUrl = "https://secure.last.fm/login";
settings.profileUrl = "https://www.last.fm/user/{USERNAME}";
settings.unscrobbleUrl = "https://www.last.fm/user/{USERNAME}/unscrobble"
settings.libraryUrl = "https://www.last.fm/user/{USERNAME}/library";


settings.userGetRecentTrackLimit = "200";

settings.apiKey = "";
settings.userGetRecentTrackPages = "10";
settings.username = "";
settings.password = "";
settings.artistNames = [];

module.exports = settings;