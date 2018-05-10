# create index: lastfm, type: Track
curl -X PUT "https://search-lastfm-rtb2gvac6g3v65is2eaxaukgmu.us-east-1.es.amazonaws.com/lastfm" -H 'Content-Type: application/json' -d'
{
    "settings" : {
        "index" : {
            "number_of_shards" : 3, 
            "number_of_replicas" : 2 
        }
    },
    "mappings" : {
    	"Track" :{
		    "properties": { 
		        "artist": { "type": "text" }, 
		        "timestamp": { "type": "text" }, 
		        "similars": {"type":"text"},
		        "tags": { "type": "text" },
		        "track_id": {"type":"text"},
		        "title": {"type":"text"}
		    }
		}
    }
}
'

# delete index
curl -X DELETE "https://search-lastfm-rtb2gvac6g3v65is2eaxaukgmu.us-east-1.es.amazonaws.com/lastfm"


# put bulk
curl -XPOST  "https://search-lastfm-rtb2gvac6g3v65is2eaxaukgmu.us-east-1.es.amazonaws.com/_bulk" -H 'Content-Type: application/json' --data-binary  @./bulk_0.json

# get by id
curl -X GET "https://search-lastfm-rtb2gvac6g3v65is2eaxaukgmu.us-east-1.es.amazonaws.com/lastfm/Track/TRWUUOR128F1467BE5"


# general search fields
curl -X GET "https://search-lastfm-rtb2gvac6g3v65is2eaxaukgmu.us-east-1.es.amazonaws.com/lastfm/Track/_search" -H 'Content-Type: application/json' -d'
{
    "query": {
        "multi_match" : {
            "query":  "Costa",
            "fields": [ "artist", "tags", "title" ]
        }
    }
}
'

# 

