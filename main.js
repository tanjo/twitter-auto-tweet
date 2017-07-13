var Config = require('./config.json');
var fs = require('fs');
var kuromoji = require('kuromoji');
var Twitter = require('twitter');
var twitter = new Twitter({
  consumer_key: Config.consumer_key,
  consumer_secret: Config.consumer_secret,
  access_token_key: Config.access_token_key,
  access_token_secret: Config.access_token_secret
});

var builder = kuromoji.builder({
  dicPath: 'node_modules/kuromoji/dict'
});

class Markov {
  constructor(n) {
    this.data = {};
  }

  // データ登録
  add(words) {
    for (var i = 0; i <= words.length; i++) {
      var now = words[i];
      var prev = words[i - 1];
      if (this.data[prev] === undefined) {
        this.data[prev] = [];
      }
      this.data[prev].push(now);
    }
  }

  // 指定された文字に続く文字をランダムに返す
  sample(word) {
    var words = this.data[word];
    if (words === undefined) {
      words = [];
    }
    return words[Math.floor(Math.random() * words.length)];
  }

  // マルコフ連鎖でつなげた文字を返す
  make() {
    var sentences = [];
    var word = this.sample(undefined);
    while(word) {
      sentences.push(word);
      word = this.sample(word);
    }
    return sentences.join('');
  }
}

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
    twitter.post('statuses/update', {
            status: "[自動生成] \n" + result
          }, function(error, tweet, response) {
            if (!error) {
              console.log(tweet.text);
            } else {
              console.log('Twitter Error: ', error);
            }
          });
  }
}

// ---

builder.build(function(error, tokenizer) {
  if (error) {
    throw error;
  }

  var params = {
    screen_name: 'makietan',
    count: 200
  };
  twitter.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (error) {
      throw error;
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
