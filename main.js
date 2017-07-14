var fs = require('fs');
var kuromoji = require('kuromoji');
var Markov = require('./markov.js');
var TwitterClient = require('./twitter_client.js');

var builder = kuromoji.builder({
  dicPath: 'node_modules/kuromoji/dict'
});

var twitterClient = new TwitterClient();
var markov = new Markov();

function createTextAndPostTweet(lines, tokenizer) {
  lines.forEach(function(line) {
    var tokens = tokenizer.tokenize(line);

    var words = tokens.map(function(token) {
      return token.surface_form;
    });
    markov.add(words);
  });

  var result = markov.make();

  for (var n = 0; n < 1; n++) {
    twitterClient.post("[自動生成] \n" + result);
  }
}

// ---

builder.build(function(error, tokenizer) {
  if (error) {
    throw error;
  }

  twitterClient.get("makietan", 200, null, function(error, tweets) {
    if (error) {
      console.log(error);
      return;
    }
    var tweetTexts = tweets.map(function(tweet) {
      return tweet.text;
    }).filter(function(tweet) {
      return tweet.indexOf("RT");
    }).filter(function(tweet) {
      return tweet.indexOf('[自動生成]');
    });
    createTextAndPostTweet(tweetTexts, tokenizer);
  });

  // var lines = [];
  // var lines = data.split('\n');
});
