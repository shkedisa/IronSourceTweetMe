# IronSourceTweetMe

**Description**:
This is a service that integrates with Twitter API and exposes a REST API to perform multiple operations.
The service serves at https://agile-woodland-55532.herokuapp.com

**Endpoints**:

1. `/tweets`: `Http GET` request, returns tweets based on query params.
* *Required* Params:

        1. `query` - tweets that conatin the given text inside this field.
* *Optional*:

        1. `count` - Number of results to return. Must be a positive integer (Maximum is 100 results)
        2. `fields` - Each tweet contains multiple fields. This params enables the user to decide which field should be returned. E.G `fields=full_text,lang`
        
    Request for example: `https://agile-woodland-55532.herokuapp.com/tweets?query=dog&count=5&fields=full_text,lang`
2. `/tweet`
3. `/followers`
4. `/userTimeline`