#lastfm-unscrobbler
A simple node app to unscrobble artists from your Last.fm account

The unscrobbler depends uses the latest tracks API from Last.fm and so requires an API key to be able to access it.  Simply head over to the [Last.fm Developer Portal](http://www.last.fm/api/account/create) and create an API account.  Last.fm will then issue you with an API key.

##Usage info

    A tool to unscrobble all tracks from a list of artists

    Usage
	    lastfm-unscrobbler -u -p -k -a [-g]
      lastfm-unscrobbler -h | --help
      lastfm-unscrobbler -v | --version

    Options
      -u, --username  Last.fm username
      -p, --password  Last.fm password
      -g, --pages  Number of pages to get
      -k, --apiKey  API key to access Last.fm API
      -a, --artists  Comma seperated list of artists to unscrobble
      -h, --help Show  this help message
      -v, --version  Show version information

    Example
      $ lastfm-unscrobbler -u joe_bloggs -p pa55w0rd -k 47a4f5eejhd94wpodi309444274145aa5 -a "Queen, The Eagles"

##Logging

Logging is managed by [bunyan](https://github.com/trentm/node-bunyan), pipe the log output to bunyan for pretty logging.

	$ node ./lastfm-unscrobbler -u joe_bloggs -p pa55w0rd -k 47a4f5eejhd94wpodi309444274145aa5 -a "Queen, The Eagles" | ./node_modules/bunyan/bin/bunyan
