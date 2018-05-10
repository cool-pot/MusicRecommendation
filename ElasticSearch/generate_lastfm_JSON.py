#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Thu Apr 26 15:02:41 2018

@author: zhouyi
"""

import os
import json
import time

raw_jsons = []
for root, dirs, files in os.walk("/Users/zhouyi/Downloads/lastfm_test", topdown=False):
    for name in files:
        raw_jsons.append(os.path.join(root, name))
        
for root, dirs, files in os.walk("/Users/zhouyi/Downloads/lastfm_train", topdown=False):
    for name in files:
        raw_jsons.append(os.path.join(root, name))

def listMapper(l):
    return list(map(lambda x:x[0], l))


print("Total Tracks: ",len(raw_jsons))
print("----------------------------------------------------------------------------")

fwrite = open("/Users/zhouyi/Desktop/lastfm/bulk_0.json", "w")

_start = time.time()

for i,raw_json in enumerate(raw_jsons):
    
    if i%2500 == 0: 
        fwrite.close()
        newfile_name = "/Users/zhouyi/Desktop/lastfm/bulk_" + str(i) + ".json"
        fwrite = open(newfile_name, "w")
        print("Wrint to %s" % newfile_name)
        print("Time used %d" %(int(time.time()-_start)))
    f = open(raw_json, 'r')
    data = json.load(f)
    if "similars" in data:
        data["similars"] = listMapper(data["similars"])
    if "tags" in data:
        data["tags"] = listMapper(data["tags"] )
    line1 = json.dumps({ "create": { "_index": "lastfm", "_type":   "Track", "_id": data["track_id"]  } })
    line2 = json.dumps(data)
    f.close()
    
    print(line1, file = fwrite)
    print(line2, file = fwrite)

fwrite.close()