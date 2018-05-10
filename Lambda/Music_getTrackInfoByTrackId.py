import json
from botocore.vendored import requests


def getTrackInfoByTrackId(uri, track_id):
    """Simple Elasticsearch Query"""
    request_resource = uri + track_id
    response = requests.get(request_resource)
    results = json.loads(response.text)
    return results
    

def lambda_handler(event, context):
    uri = "https://search-lastfm-rtb2gvac6g3v65is2eaxaukgmu.us-east-1.es.amazonaws.com/lastfm/Track/"
    track_id = event["track_id"]
    results = getTrackInfoByTrackId(uri, track_id)
    return results