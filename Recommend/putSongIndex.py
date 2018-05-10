import boto3
from collections import Counter
import time

s3 = boto3.resource('s3')
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('SongIndexToId')

bucket = s3.Bucket('million-song-dataset-yizhou')
prefix = "s3://million-song-dataset-yizhou/"
fileList = []
for obj in bucket.objects.filter( Prefix='TasteProfile/songIndex/').all():
    fileName = obj.key
    if fileName.startswith("TasteProfile/songIndex/part"):
        fileList.append(os.path.join(prefix,fileName))

# putItem
def putIntoDB(x):
    response = table.put_item(
        Item = {
            'song_id': x[0],
            'song_index': x[1]
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
def putSongIndexFile(fileName):
    _start_time = time.time()
    basefile = fileName.split("/")[-1]
    rdd = sc.textFile(fileName).map(lambda x:x.split(","))
    col = rdd.collect()
    print("------ Total %d lines to be processed in %s ------" %(len(col), basefile) )
    responseList = []
    for i,x in enumerate(col):
        if i % 1000 == 0: print("[%d/%d] Lines" %(i,len(col)))
        r = putIntoDB(x)
        responseList.append(r)
    log = ReportResponses(responseList)
    _end_time = time.time()
    run_time = "[Time used] %d seconds" % int(_end_time-_start_time)
    print(basefile, "===>", log, run_time)
    
    
# putBatch
client = boto3.client('dynamodb')
def putBatchIntoDB(xlist):
    def transform(x):
        out = dict()
        out['PutRequest'] = dict()
        out['PutRequest']['Item'] =  dict()
        out['PutRequest']['Item']['song_id'] = dict()
        out['PutRequest']['Item']['song_index'] = dict()
        out['PutRequest']['Item']['song_id']['S'] = dict()
        out['PutRequest']['Item']['song_index']['S'] = dict()
        out['PutRequest']['Item']['song_id']['S'] = x[0] 
        out['PutRequest']['Item']['song_index']['S'] = x[1]
        return out
    putList = list(map(transform,xlist))
    response = client.batch_write_item(
        RequestItems={
            'SongIndexToId': putList
        }
    )
    unsuccessful = response['UnprocessedItems']
    if len(unsuccessful) == 0:
        return []
    else:
        return unsuccessful['SongIndexToId']

    
def putBatchSongIndexFile(fileName, batchSize=25, times = 1.0):
    _start_time = time.time()
    basefile = fileName.split("/")[-1]
    rdd = sc.textFile(fileName).map(lambda x:x.split(","))
    col = rdd.collect()
    _iter = 0
    total = len(col)
    #print("------ Total %d lines to be processed in %s ------" %(total, basefile))
    unsuccessfulList = []
    while _iter < total:
        #if _iter % 1000 == 0: print("[%d/%d] Lines" %(_iter, len(col)))
        time.sleep(0.1*times)
        xlist = col[_iter:_iter+batchSize]
        unsuccessful = putBatchIntoDB(xlist)
        if len(unsuccessful) > 0: 
            unsuccessfulList.append(unsuccessful)
        _iter += batchSize
    totalUS = []
    if len(unsuccessfulList) > 0:
        for us in unsuccessfulList:
            totalUS = totalUS + us
        successful = total-len(totalUS)
        rate = "%d/%d put into Table. " %(successful,total)
        log = "[Error]" + rate 
    else:
        rate = "%d/%d put into Table. " %(total,total)
        log = "[Success]" + rate 
    _end_time = time.time()
    run_time = "[Time used] %d seconds" % int(_end_time-_start_time)
    print(basefile, "===>", log, run_time)
    return totalUS


def Backup(usList):
    def extract(x):
        return [x['PutRequest']['Item']['song_id']['S'], x['PutRequest']['Item']['song_index']['S']]
    for us in usList:
        xlist = list(map(extract, us))
        responseList = []
        for x in xlist:
            r = putIntoDB(x)
            responseList.append(r)
        log = ReportResponses(responseList)
        print(log)
        
usList = []
times = 1.0 # Auto extending the time gap when failing too many times  
for fileName in fileList:
    time.sleep(1.0 *times)
    us = putBatchSongIndexFile(fileName, batchSize=25, times = times)
    if len(us):
        usList.append(us)
    if len(usList) >= 5:
        print("------------------------Backing Up-----------------------------")
        time.sleep(5*times)
        Backup(usList)
        print("---------------------------------------------------------------")
        usList = []
        times *= 1.1
Backup(usList)