import boto3
from collections import Counter
import time


dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('SongIdToTrackId')

tuple_path = "s3://million-song-dataset-yizhou/TasteProfile/taste_profile_song_to_tracks.txt"

def listMapper(x):
	song_id = x[0]
	track_id_list = x[1:]
	track_id_list = ",".join(track_id_list)
	return [song_id, track_id_list]

# putItem
def putIntoDB(x):
    response = table.put_item(
        Item = {
            'song_id': x[0],
            'track_id_list': x[1]
        }
    )
    return (x[0],response)

def ReportResponses(responseList):
    exceptions = []
    for song_id, response in responseList:
        http_code = response['ResponseMetadata']['HTTPStatusCode']
        if http_code<200 or http_code > 206:
            exceptions.append(song_index)
    total = len(responseList)
    successful = len(responseList)-len(exceptions)
    rate = "%d/%d put into Table. " %(successful,total) 
    if len(exceptions) > 0:
        log = "[Error]" + rate + "Failed Song Id:" + ",".join(exceptions)
    else:
        log = "[Success]" + rate
    return log

#putBatch
client = boto3.client('dynamodb')
def putBatchIntoDB(xlist):
    def transform(x):
        out = dict()
        out['PutRequest'] = dict()
        out['PutRequest']['Item'] =  dict()
        out['PutRequest']['Item']['song_id'] = dict()
        out['PutRequest']['Item']['track_id_list'] = dict()
        out['PutRequest']['Item']['song_id']['S'] = dict()
        out['PutRequest']['Item']['track_id_list']['S'] = dict()
        out['PutRequest']['Item']['song_id']['S'] = x[0] 
        out['PutRequest']['Item']['track_id_list']['S'] = x[1]
        return out
    putList = list(map(transform,xlist))
    response = client.batch_write_item(
        RequestItems={
            'SongIdToTrackId': putList
        }
    )
    unsuccessful = response['UnprocessedItems']
    if len(unsuccessful) == 0:
        return []
    else:
        return unsuccessful['SongIdToTrackId']

def Backup(usList):
    def extract(x):
        return [x['PutRequest']['Item']['song_id']['S'], x['PutRequest']['Item']['track_id_list']['S']]
    for us in usList:
        xlist = list(map(extract, us))
        responseList = []
        for x in xlist:
            r = putIntoDB(x)
            responseList.append(r)
        log = ReportResponses(responseList)
        print(log)


rdd = sc.textFile(tuple_path).map(lambda x:x.split("\t")).map(listMapper)
col = rdd.collect()
col = list(filter(lambda x: len(x[1]) > 0))


# main
times = 1.
batchSize = 25
_start_time = time.time()
_iter = 0
total = len(col)
basefile = tuple_path
print("------ Total %d lines to be processed in %s ------" %(total, basefile))
unsuccessfulList = []
while _iter < total:
    if _iter % 500 == 0: print("[%d/%d] Lines, using %d seconds" %(_iter, len(col), int(time.time()-_start_time) ))
    time.sleep(0.1*times)
    xlist = col[_iter:_iter+batchSize]
    unsuccessful = putBatchIntoDB(xlist)
    if len(unsuccessful) > 0: 
        unsuccessfulList.append(unsuccessful)
        print("[Iter %d][Error]: %d unprocessed" % (_iter,len(unsuccessful)) )
    _iter += batchSize
    if len(unsuccessfulList)>=5:
    	Backup(unsuccessfulList)
    	times *= 1.1
    	unsuccessfulList = []

Backup(unsuccessfulList)


