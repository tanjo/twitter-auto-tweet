var Config = require('./config.json');
var Twitter = require('twitter');

module.exports = class TwitterClient {
  constructor() {
    this.twitter = new Twitter({
      consumer_key: Config.consumer_key,
      consumer_secret: Config.consumer_secret,
      access_token_key: Config.access_token_key,
      access_token_secret: Config.access_token_secret
    });
  }

  post(text, callback) {
    this.twitter.post('statuses/update', {
            status: text
          }, function(error, tweet, response) {
            if (callback) {
              callback(error, tweet);
            }
          });
  }

  get(screenName, count, sinceId, callback) {
    sinceId = sinceId ? sinceId : undefined;
    var params = {
      screen_name: screenName,
      count: count,
      since_id: sinceId,
      exclude_replies: true,
      include_rts: false
    };
    this.twitter.get('statuses/user_timeline', params, function(error, tweets, response) {
      if (callback) {
        callback(error, tweets);
      }
    });
  }
}
