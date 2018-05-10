import json
import time
import os
from botocore.vendored import requests


def getTrackInfoByTag(uri, tag):
    """Simple Elasticsearch Query"""

    query = json.dumps({
        "query": {
            "match": {
                    "tags": tag
            }
        }
    })
    headers = {'Content-Type': 'application/json'}
    response = requests.get(uri,headers=headers, data=query)
    results = json.loads(response.text)

    return results
    

def lambda_handler(event, context):
    tag = event["tag"]
    uri = "https://search-lastfm-rtb2gvac6g3v65is2eaxaukgmu.us-east-1.es.amazonaws.com/lastfm/Track/_search"
    results = getTrackInfoByTag(uri, tag)
    return results
