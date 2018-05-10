import json
import time
import os
from botocore.vendored import requests


def generalSearch(uri, term):
    """Simple Elasticsearch Query"""

    query = json.dumps({
        "query": {
        "multi_match" : {
            "query":  term,
            "fields": [ "artist", "tags", "title" ]
            }
        }
    })
    headers = {'Content-Type': 'application/json'}
    response = requests.get(uri,headers=headers, data=query)
    results = json.loads(response.text)

    return results
    

def lambda_handler(event, context):
    term = event["term"]
    uri = "https://search-lastfm-rtb2gvac6g3v65is2eaxaukgmu.us-east-1.es.amazonaws.com/lastfm/Track/_search"
    results = generalSearch(uri, term)
    return results