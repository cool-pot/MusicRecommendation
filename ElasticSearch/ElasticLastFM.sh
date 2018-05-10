curl -X PUT "https://search-predictions-yelp-wdtlnynq7zxm6cn4tsmrqfayjm.us-east-1.es.amazonaws.com/predictions" -H 'Content-Type: application/json' -d'
{
    "settings" : {
        "index" : {
            "number_of_shards" : 3, 
            "number_of_replicas" : 2 
        }
    },
    "mappings" : {
    	"Prediction" :{
		    "properties": { 
		        "buseness_id": { "type": "text" }, 
		        "category": { "type": "text" }, 
		        "yelp_rating": {"type":"float"},
		        "number_of_reviews": { "type": "integer" },
		        "score": {"type":"float"},
		        "label": {"type":"integer"}
		    }
		}
    }
}
'