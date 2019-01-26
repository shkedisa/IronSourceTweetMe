# IronSourceTweetMe

**Description**:

This is a service that integrates with Twitter API and exposes a REST API to perform multiple operations.
The service serves at https://agile-woodland-55532.herokuapp.com

**Endpoints**:

1. `/tweets`: `Http GET` request, returns tweets based on query params.
* *Required* Params:

        1. `query` - tweets that conatin the given text inside this field.
* *Optional*:

        1. `count` - Number of results to return. Must be a positive integer (Maximum is 100 results, if exists)
        2. `fields` - Each tweet contains multiple fields. This params enables the user to decide which field should be returned. E.G `fields=full_text,lang`
        
    Request for example: `https://agile-woodland-55532.herokuapp.com/tweets?query=dog&count=5&fields=full_text,lang`
    
2. `/tweet`: `Http POST` request, posts a new tweet at https://twitter.com/ShkediSapir
* *Body Structure*:

        {
          "text": "SOME_TEXT"
        }
        
        Note: The text must be different at each /tweet request.
             

3. `/followers`: `Http GET` request, returns users followers IDs.
* *Params*:

        1. `username` - The Username of the user that its followers requested.
        
    Request for example: `https://agile-woodland-55532.herokuapp.com/followers?username=bengurionu`
    
4. `/userTimeline`: `Http GET` request, returns users timeline tweets.
* *Required* Params:

        1. `username` - The Username of the user that its timeline requested.
* *Optional*:

        1. `count` - Number of results to return. Must be a positive integer (Maximum is 100 results, if exists)
        
    Request for example: `https://agile-woodland-55532.herokuapp.com/userTimeline?username=bengurionu` 