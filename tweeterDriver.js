const Twitter = require('twitter');
const validation = require('./validation');

exports.MAX_NUMBER_OF_RESULTS = 100;

const client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

exports.getTweets = function(res, query, count, fields) {
    client.get('search/tweets',
        {
            q: query, count: (count < exports.MAX_NUMBER_OF_RESULTS ? count : exports.MAX_NUMBER_OF_RESULTS),
            tweet_mode: 'extended'
        },
        function (error, tweets, response) {
            if (error) {
                console.log(error);
                validation.sendTwitterError(res);
            } else {
                filterFields(tweets, fields, res);
            }
        });
};

exports.postTweet = function(res, text) {
    client.post('statuses/update', {status: text}, function (error, tweet, response) {
        if (error) {
            validation.sendTwitterError(res);
        } else {
            res.send();
        }
    });
};

exports.getFollowers = function(res, username) {
    client.get('followers/ids', {screen_name: username},
        function (error, userFollowers, response) {
            if (error) {
                console.log(error);
                validation.sendTwitterError(res);
            } else {
                res.send(userFollowers);
            }
        });
};

exports.getUserTimeline = function(res, username, count) {
    client.get('statuses/user_timeline',
        {
            screen_name: username, count: (count < exports.MAX_NUMBER_OF_RESULTS ? count : exports.MAX_NUMBER_OF_RESULTS)
        },
        function (error, tweets, response) {
            if (error) {
                console.log(error);
                validation.sendTwitterError(res);
            } else {
                res.send(tweets);
            }
        });
};

function filterFields(fromTweets, withFields, toResponse) {
    if (withFields === undefined) {
        toResponse.send(fromTweets['statuses'])
    } else {
        let FieldsToFilterArr = withFields.split(',');
        let filteredTweets = fromTweets['statuses'].map(
            function (tweet) {
                let currentTweet = {};
                FieldsToFilterArr.forEach(function (field) {
                    currentTweet[field] = tweet[field];
                });
                return currentTweet;
            }
        );
        toResponse.send(filteredTweets)
    }
}