//TODO
let Twitter = require('twitter');
let express = require('express');
let bodyParser = require('body-parser');
let app = express();

app.use(bodyParser.json());

let client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

const port = process.env.PORT || 8081;
app.listen(port, function () {
    console.log('app listening on port %s', port);
});

let maxNumberOfResults = 100;

function performWithValidation(validationConstrains, success, failure) {
    let allValidationsSucceeded = true;
    validationConstrains.forEach(function (validations) {
            if (!validations[1](validations[0])) {
                failure();
                allValidationsSucceeded = false;
                return;
            }
        }
    );
    if (allValidationsSucceeded) {
        success();
    }
}

function validateNonEmptyString(str) {
    return (str !== undefined && str.length > 0);
}

function validateIsPositiveNumber(numStr) {
    let num = parseInt(numStr);
    return (num !== undefined && Number.isInteger(num) && num > 0);
}

function sendError(res, withCode, withMessage) {
    res.status(withCode).send(withMessage);
}

function getTweets(res, query, count, fields) {
    client.get('search/tweets',
        {
            q: query, count: (count < maxNumberOfResults ? count : maxNumberOfResults),
            tweet_mode: 'extended'
        },
        function (error, tweets, response) {
            if (error) {
                console.log(error);
                sendError(res, 500, "Error from Twitter");
            } else {
                if (fields === undefined) {
                    res.send(tweets['statuses'])
                } else {
                    let FieldsToFilterArr = fields.split(',');
                    let filteredTweets = tweets['statuses'].map(
                        function (tweet) {
                            let currentTweet = {};
                            FieldsToFilterArr.forEach(function (field) {
                                currentTweet[field] = tweet[field];
                            });
                            return currentTweet;
                        }
                    );
                    res.send(filteredTweets)
                }
            }
        });
}

app.get('/tweets', function (req, res) {
    let query = req.query.query;
    let count = req.query.count || maxNumberOfResults;
    let fields = req.query.fields;
    performWithValidation([[query, validateNonEmptyString], [count, validateIsPositiveNumber]], () => getTweets(res, query, count, fields), () => {
        sendError(res, 400, "Invalid Query");
    });
});


app.post('/tweet', function (req, res) {
    let text = req.body.text;
    performWithValidation([[text, validateNonEmptyString]], () => {
        client.post('statuses/update', {status: text}, function (error, tweet, response) {
            if (error) {
                sendError(res, 500, "Error from Twitter");
            } else {
                res.send();
            }
        });
    }, () => {
        sendError(res, 400, "Invalid Text");
    });
});


app.get('/followers', function (req, res) {
    let username = req.query.username;
    performWithValidation([[username, validateNonEmptyString]], () => {
        client.get('followers/ids', { screen_name: username },
            function (error, userFollowers, response) {
                if (error) {
                    console.log(error);
                    sendError(res, 500, "Error from Twitter");
                } else {
                    res.send(userFollowers);
                }
            });
    }, () => {
        sendError(res, 400, "Invalid Username");
    });
});


app.get('/userTimeline', function (req, res) {
    let username = req.query.username;
    let count = req.query.count || maxNumberOfResults;
    performWithValidation([[username, validateNonEmptyString], [count, validateIsPositiveNumber]], () => {
        client.get('statuses/user_timeline',
            {
                screen_name: username, count: (count < maxNumberOfResults ? count : maxNumberOfResults)
            },
            function (error, tweets, response) {
                if (error) {
                    console.log(error);
                    sendError(res, 500, "Error from Twitter");
                } else {
                    res.send(tweets);
                }
            });
    }, () => {
        sendError(res, 400, "Invalid username");
    });
});


app.get('/', function (req, res) {
    res.send('Welcome!');
});