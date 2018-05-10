import boto3

def lambda_handler(event, context):
    #get user_index
    try:
        user_id = str(event['user_id'])
        client = boto3.client('dynamodb')
        response = client.get_item(
            TableName='UserIdToIndex',
            Key={
                'user_id' : {'S': user_id}
            },
            AttributesToGet = ["user_index"]
        )
        user_index = response["Item"]["user_index"]["S"]
    except:
        return {"Status": "Failed", "Log": "Error when accessing Table UserIdToIndex", "RecommendList": [], "Event":event}
    
    #get song_index_list
    try:
        response = client.get_item(
            TableName='UserToSongs',
            Key={
                'user_index' : {'S': user_index}
            },
            AttributesToGet = ["song_index_list"]
        )
        song_index_list = response["Item"]["song_index_list"]["S"]
    except:
        return {"Status": "Failed", "Log": "Error when accessing Table UserToSongs", "RecommendList": [],"Event":event}
    
    # get song_id_list
    songs = song_index_list.split(",")
    song_id_list = []
    exceptions = []
    for song_index in songs:
        try:
            response = client.get_item(
                TableName='SongIndexToId',
                Key={
                    'song_index' : {'S': song_index}
                },
                AttributesToGet = ["song_id"]
            )
            song_id = response["Item"]["song_id"]["S"]
            song_id_list.append(song_id)
        except:
            exceptions.append(song_index)
            continue
    if len(song_id_list) == len(songs):
        log =  "Transform song indexes succeeded;"
    else:
        log =  "Failed song indexes:" + ",".join(exceptions) + ";"
        
    # song_id map to track_id
    exceptions = []
    track_id_list = []
    for song_id in song_id_list:
        try:
            response = client.get_item(
                TableName='SongIdToTrackId',
                Key={
                    'song_id' : {'S': song_id}
                },
                AttributesToGet = ["track_id_list"]
            )
            temp = response["Item"]["track_id_list"]["S"]
            track_id_list = track_id_list + temp.split(",")
        except:
            exceptions.append(song_id)
            continue
    if len(exceptions) == 0:
        log = log + "Transform song ids succeeded;"
    else:
        log =  log + "Failed song ids:" + ",".join(exceptions) + ";"
    return {"Status": "Success", "Log": log, "RecommendList": track_id_list,"Event":event}
    