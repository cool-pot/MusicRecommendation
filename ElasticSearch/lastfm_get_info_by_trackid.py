#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Fri Apr 27 17:09:43 2018

@author: zhouyi
"""
import json
import requests


uri = "https://search-lastfm-rtb2gvac6g3v65is2eaxaukgmu.us-east-1.es.amazonaws.com/lastfm/Track/"

def getTrackInfoByTrackId(uri, track_id):
    """Simple Elasticsearch Query"""
    request_resource = uri + track_id
    response = requests.get(request_resource)
    results = json.loads(response.text)
    return results

res = getTrackInfoByTrackId(uri, track_id)

