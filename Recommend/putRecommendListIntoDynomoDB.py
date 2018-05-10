# Inserted 1770*576, one million users with their recommendList


import boto3
from collections import Counter
import time

s3 = boto3.resource('s3')
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('UserToSongs')

bucket = s3.Bucket('million-song-dataset-yizhou')
prefix = "s3://million-song-dataset-yizhou/"
fileList = []
for obj in bucket.objects.filter( Prefix='TasteProfile/recommendList/').all():
    fileName = obj.key
    if fileName.startswith("TasteProfile/recommendList/part"):
        fileList.append(os.path.join(prefix,fileName))

# putItem
def putIntoDB(x):
    response = table.put_item(
        Item = {
            'user_index': x[0],
            'song_index_list': x[1]
        }
    )
    return (x[0],response)
def ReportResponses(responseList):
    exceptions = []
    for user_index, response in responseList:
        http_code = response['ResponseMetadata']['HTTPStatusCode']
        if http_code<200 or http_code > 206:
            exceptions.append(user_index)
    total = len(responseList)
    successful = len(responseList)-len(exceptions)
    rate = "%d/%d put into Table. " %(successful,total) 
    if len(exceptions) > 0:
        log = "[Error]" + rate + "Failed User Index:" + ",".join(exceptions)
    else:
        log = "[Success]" + rate
    return log
def putRecommendFile(fileName):
    _start_time = time.time()
    basefile = fileName.split("/")[-1]
    recommendList = sc.textFile(fileName).map(lambda x:x.split("\t"))
    col = recommendList.collect()
    responseList = []
    for x in col:
        r = putIntoDB(x)
        responseList.append(r)
    log = ReportResponses(responseList)
    _end_time = time.time()
    run_time = "[Time used] %d seconds" % int(_end_time-_start_time)
    print(basefile, "===>", log, run_time)

    
    


"""
EG:
response = client.batch_write_item(
    RequestItems={
        'UserToSongs':[
         {'PutRequest': {'Item': {'user_index': {"S":"66666666"}, 'song_index_list': {"S":"66666666,77777777"} }}},
         {'PutRequest': {'Item': {'user_index': {"S":"66666667"}, 'song_index_list': {"S":"66666667,77777776"} }}}
        ]
    }
)
"""

# putBatch
client = boto3.client('dynamodb')
def putBatchIntoDB(xlist):
    def transform(x):
        out = dict()
        out['PutRequest'] = dict()
        out['PutRequest']['Item'] =  dict()
        out['PutRequest']['Item']['user_index'] = dict()
        out['PutRequest']['Item']['song_index_list'] = dict()
        out['PutRequest']['Item']['user_index']['S'] = dict()
        out['PutRequest']['Item']['song_index_list']['S'] = dict()
        out['PutRequest']['Item']['user_index']['S'] = x[0] 
        out['PutRequest']['Item']['song_index_list']['S'] = x[1]
        return out
    putList = list(map(transform,xlist))
    response = client.batch_write_item(
        RequestItems={
            'UserToSongs': putList
        }
    )
    unsuccessful = response['UnprocessedItems']
    if len(unsuccessful) == 0:
        return []
    else:
        return unsuccessful['UserToSongs']
def putBatchRecommendFile(fileName, batchSize=25):
    _start_time = time.time()
    basefile = fileName.split("/")[-1]
    recommendList = sc.textFile(fileName).map(lambda x:x.split("\t"))
    col = recommendList.collect()
    unsuccessfulList = []
    _iter = 0
    total = len(col)
    while _iter < total:
        time.sleep(0.15)
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
        return [x['PutRequest']['Item']['user_index']['S'], x['PutRequest']['Item']['song_index_list']['S']]
    for us in usList:
        xlist = list(map(extract, us))
        responseList = []
        for x in xlist:
            r = putIntoDB(x)
            responseList.append(r)
        log = ReportResponses(responseList)
        print(log)

usList = []
for fileName in fileList[393:]:
    time.sleep(1.5)
    us = putBatchRecommendFile(fileName, batchSize=25)
    if len(us):
        usList.append(us)
    if len(usList) >= 5:
        print("------------------------Backing Up-----------------------------")
        time.sleep(5)
        Backup(usList)
        print("---------------------------------------------------------------")
        usList = []
        
Backup(usList)
        


    


        



    

