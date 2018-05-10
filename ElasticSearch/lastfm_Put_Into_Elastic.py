#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Fri Apr 27 15:53:13 2018

@author: zhouyi
"""

import json
import time
import requests
import os

def putBulkElastic(uri, filename):
    """Simple Elasticsearch Query"""
    f = open(filename, 'r')
    query = f.read()
    headers = {'Content-Type': 'application/json'}
    response = requests.post(uri,headers=headers, data=query)
    results = json.loads(response.text)
    f.close()
    return results


json_files_to_put = []
for root, dirs, files in os.walk("/Users/zhouyi/Desktop/lastfm/", topdown=False):
    for name in files:
        json_files_to_put.append(os.path.join(root, name))


uri = "https://search-lastfm-rtb2gvac6g3v65is2eaxaukgmu.us-east-1.es.amazonaws.com/_bulk"

result_list = []
_start_put = time.time()
for filename in json_files_to_put:
    time.sleep(1)
    print("Put file %s" % filename)
    print("Time used: %d" % int(time.time()-_start_put))
    results = putBulkElastic(uri, filename)
    result_list.append(results)
    

    