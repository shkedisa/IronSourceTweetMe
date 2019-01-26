const express = require('express');
const bodyParser = require('body-parser');
const validation = require('./validation');
const tweeterDriver = require('./tweeterDriver');

let app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 8081;

app.listen(PORT, function () {
    console.log("app listening on port " + PORT);
});

app.post('/tweet', function (req, res) {
    let text = req.body.text;
    validation.performWithValidation([[text, validation.validateNonEmptyString, validation.invalidString(validation.TEXT)]],
        () => tweeterDriver.postTweet(res, text),
        (errorMsg) => validation.sendValidationError(res, errorMsg));
});


app.get('/followers', function (req, res) {
    let username = req.query.username;
    validation.performWithValidation([[username, validation.validateNonEmptyString, validation.invalidString(validation.USERNAME)]],
        () => tweeterDriver.getFollowers(res, username),
        (errorMsg) => validation.sendValidationError(res, errorMsg));
});


app.get('/userTimeline', function (req, res) {
    let username = req.query.username;
    let count = req.query.count || tweeterDriver.MAX_NUMBER_OF_RESULTS;
    validation.performWithValidation([[username, validation.validateNonEmptyString, validation.invalidString(validation.USERNAME)], [count, validation.validateIsPositiveNumber, validation.INVALID_COUNT]],
        () => tweeterDriver.getUserTimeline(res, username, count),
        (errorMsg) => validation.sendValidationError(res, errorMsg));
});


app.get('/', function (req, res) {
    res.send('Welcome!');
});

app.get('/tweets', function (req, res) {
    let query = req.query.query;
    let count = req.query.count || tweeterDriver.MAX_NUMBER_OF_RESULTS;
    let fields = req.query.fields;
    validation.performWithValidation([[query, validation.validateNonEmptyString, validation.invalidString(validation.QUERY)], [count, validation.validateIsPositiveNumber, validation.INVALID_COUNT]],
        () => tweeterDriver.getTweets(res, query, count, fields),
        (errorMsg) => validation.sendValidationError(res, errorMsg));
});