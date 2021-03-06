# IronSourceTweetMe

<br/>

**Description**:

This is a service that integrates with Twitter API and exposes a REST API to perform multiple operations.
The service serves at https://agile-woodland-55532.herokuapp.com

<br/>

**Endpoints**:

1. `/tweets`: `Http GET` request, returns tweets based on query params.
* *Required* Params:

        1. `query` - tweets that conatin the given text inside this field.
* *Optional*:

        1. `count` - Number of results to return. Must be a positive integer (Maximum is 100 results, if exists)
        2. `fields` - Each tweet contains multiple fields. This params enables the user to decide which field should be returned. E.G `fields=full_text,lang`
        
    Request for example: `https://agile-woodland-55532.herokuapp.com/tweets?query=dog&count=5&fields=full_text,lang`
    
<br/>

2. `/tweet`: `Http POST` request, posts a new tweet at https://twitter.com/ShkediSapir
* *Body Structure* (JSON):

        {
          "text": "SOME_TEXT"
        }
        
        Note: You can't post more than one tweet with the same text.
         
<br/>

3. `/followers`: `Http GET` request, returns users followers IDs.
* *Params*:

        1. `username` - The user to return the followers for.
        
    Request for example: `https://agile-woodland-55532.herokuapp.com/followers?username=bengurionu`
    
<br/>

4. `/userTimeline`: `Http GET` request, returns the tweets on the users timeline.
* *Required* Params:

        1. `username` - The user to return the timeline for.
* *Optional*:

        1. `count` - Number of results to return. Must be a positive integer (Maximum is 100 results, if exists)
        
    Request for example: `https://agile-woodland-55532.herokuapp.com/userTimeline?username=bengurionu` 