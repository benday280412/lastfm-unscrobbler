var bunyan = require('bunyan');
var meow = require('meow');

var log = bunyan.createLogger({name: 'CLIHelper'});
var self;

const cli = meow(`
    Usage
      $ foo <input>

    Options
      -u, --username  Last.fm username
      -p, --password  Last.fm password
      -g, --pages  Number of pages to get
      -k, --apiKey  API key to access Last.fm API
      -a, --artists  Comma seperated list of artists to unscrobble
      -h, --help Show  this help message
      -v, --version  Show version information

    Examples
      $ node ./lastfm-unscrobbler -u joe_bloggs -p pa55w0rd -k 47a4f5eejhd94wpodi309444274145aa5 -a "Queen, The Eagles"`, 
    {
      	alias: {
      		u: 'username',
      		p: 'password',
      		g: 'pages',
      		k: 'apiKey',
      		a: 'artists',
      		h: 'help',
      		v: 'version'
    	},
    	stopEarly: true,
    	unknown: function(unknown){
			log.error("Unknown flag " + unknown);
			process.exit(1);
    	}
	});

function CLIHelper(settings){
	this.settings = settings;
	self = this;	
}

CLIHelper.prototype.validateMandatoryFlags = function(flagArr){
	var missingFlags = "";

	if(flagArr.indexOf("u") == -1){
		missingFlags += "u, ";
	}

	if(flagArr.indexOf("p") == -1){
		missingFlags += "p, ";
	}

	if(flagArr.indexOf("k") == -1){
		missingFlags += "k, ";
	}

	if(flagArr.indexOf("a") == -1){
		missingFlags += "a, ";
	}

	if(missingFlags.length > 0){
		missingFlags = missingFlags.slice(0, missingFlags.length -2);
		log.error("Mandatory flags are missing: " + missingFlags);
		process.exit(1);
	}
}

CLIHelper.prototype.processFlags = function(){
	var flagArr = Object.keys(cli.flags);

	this.validateMandatoryFlags(flagArr);

	flagArr.forEach(function(key){
		var value = cli.flags[key];

		if(value === true){
			log.error(key + " flags value cannot be null");
			process.exit(1);
		}

		switch(key){
			case "u":
				self.handleUsername(value);
			break;
			case "p":
				self.handlePassword(value);
			break;
			case "g":
				self.handlePages(value);
			break;
			case "k":
				self.handleApiKey(value);
			break;
			case "a":
				self.handleArtists(value);
			break;
		}
	})
}

CLIHelper.prototype.handleUsername = function(value){
	console.log("u =  " + value);
	this.settings.username = value;
}

CLIHelper.prototype.handlePassword = function(value){
	console.log("pwd = " + value);
	this.settings.password = value;
}

CLIHelper.prototype.handlePages = function(value){
	console.log("g = " + value);
	this.settings.userGetRecentTrackPages = value;
}

CLIHelper.prototype.handleApiKey = function (value){
	console.log("k = " + value);
	this.settings.apiKey = value;	
}

CLIHelper.prototype.handleArtists = function(value){
	console.log("a = " + value);

	var artistsArr = value.split(",");

	for(var i = 0;i < artistsArr.length;i++){
		artistsArr[i] = artistsArr[i].trim();
	}

	this.settings.artistNames = artistsArr;		
}


module.exports = CLIHelper;