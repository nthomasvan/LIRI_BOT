//Grab data from keys.js
var fs = require('fs');
var keys = require('./keys.js');
var request = require('request');
var twitter = require('twitter');
var spotify = require('spotify');
var client = new twitter(keys.twitterKeys);


//Stored argument's array
var nodeArgv = process.argv;
var command = process.argv[2];
//movie or song
var x = "";
//attaches multiple word arguments
for (var i=3; i<nodeArgv.length; i++){
  if(i>3 && i<nodeArgv.length){
    x = x + "+" + nodeArgv[i];
  } else{
    x = x + nodeArgv[i];
  }
}

//switch cases for each command
switch(command){
  case "my-tweets":
    getTweets();
  break;

  case "spotify-this-song":
    if(x){
      getSpotifySong(x);
    } else{
      getSpotifySong("Fireflies");
    }
  break;

  case "movie-this":
    if(x){
      omdbData(x)
    } else{
      omdbData("Mr. Nobody")
    }
  break;

  case "do-what-it-says":
    doWhatSays();
  break;

  default:
    console.log("{Command Required: my-tweets, spotify-this-song, movie-this, do-what-it-says}");
  break;
}

function getTweets(){
  var screenName = {screen_name: 'nthomasvan'};
  client.get('statuses/user_timeline', screenName, function(error, tweets,response){
    if(!error){
      for(var i = 0; i<tweets.length; i++){
        var date = tweets[i].created_at;
        console.log("user:@nthomasvan: " + tweets[i].text); 
        console.log("Created At: " + date.substring(0, 20));
        console.log("-----------------------------------------");
      } 
    }else{
      console.log(error);
    }
  });
}

function getSpotifySong(song){
var Spotify = require('node-spotify-api');
 
var spotify = new Spotify({
  id: 'fa53bb3d711c42bb80604cd372df79c9',
  secret: 'fa927b09e8964f7e848d213b75303155'
});


  spotify.search({ type: 'track', query: song}, function(error, data){
    if(!error){
      for(var i = 0; i < data.tracks.items.length; i++){
        var songData = data.tracks.items[i];
        //artist
        console.log("Artist: " + songData.artists[0].name);
        //song name
        console.log("Song: " + songData.name);
        //spotify preview link
        console.log("Preview URL: " + songData.preview_url);
        //album name
        console.log("Album: " + songData.album.name);
        console.log("-----------------------------------------");
      }
    } else{
      console.log('Error occurred.');
    }
  });
}

function omdbData(movie){
  var omdbURL = 'http://www.omdbapi.com/?t=' + movie + '&plot=short&tomatoes=true&apikey=40e9cece';

  request(omdbURL, function (error, response, body){
    if(!error && response.statusCode == 200){
      var body = JSON.parse(body);

      console.log("Title: " + body.Title);
      console.log("Release Year: " + body.Year);
      console.log("IMdB Rating: " + body.imdbRating);
      console.log("Country: " + body.Country);
      console.log("Language: " + body.Language);
      console.log("Plot: " + body.Plot);
      console.log("Actors: " + body.Actors);
      console.log("Rotten Tomatoes Rating: " + body.tomatoRating);
      console.log("Rotten Tomatoes URL: " + body.tomatoURL);

    } else{
      console.log('Error occurred.')
    }
    if(movie === "Mr. Nobody"){
      console.log("-----------------------------------------");
      console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
      console.log("It's on Netflix!");
    }
  });

}

function doWhatSays(){
  fs.readFile('random.txt', "utf8", function(error, data){
    var txt = data.split(',');

    getSpotifySong(txt[1]);
  });
}