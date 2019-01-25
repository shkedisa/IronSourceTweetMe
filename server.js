//TODO asserts
let Twitter = require('twitter');
let express = require('express');
let bodyParser = require('body-parser');
let app = express();

app.use(bodyParser.json());

let client = new Twitter({ //TODO make the credentials safe? for example: "consumer_key: process.env.TWITTER_CONSUMER_KEY"
    consumer_key: 'KcTL48ZDltgRfFUwInMXFoXRB',
    consumer_secret: 'qVXshbyNvLvLeBg6Eejpm8xZ27TLou1rNnvAxH9FNDJR2AIPBc',
    access_token_key: '936957227163930625-ccrG2wOxsCaAb3fI97A0xq5C2pOk9j6',
    access_token_secret: 'KLnF0sUWAk2SBk5ZmAuJ3PQl5B4DN5u5CTXXorRSbMdEM'
    //,app_id: '16084074'
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

//q: 'MyKeyword', until:'2017-12-08T13:00:00.000Z' count: 100, include_entities: 1, tweet_mode:'extended'

app.get('/tweets', function (req, res) {
    let query = req.query.query;
    let count = req.query.count || maxNumberOfResults;
    let fields = req.query.fields;
    performWithValidation([[query, validateNonEmptyString], [count, validateIsPositiveNumber]], () => {
        client.get('search/tweets',
            {
                q: query, count: (count < maxNumberOfResults ? count : maxNumberOfResults),
                tweet_mode: 'extended'
            },
            function (error, tweets, response) {
                if (error) {
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
    }, () => {
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


app.get('/', function (req, res) {
    res.send('Welcome!');
});




