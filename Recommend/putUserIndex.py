# Not Finished Yet.

import boto3
from collections import Counter
import time

s3 = boto3.resource('s3')
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('UserIdToIndex')

bucket = s3.Bucket('million-song-dataset-yizhou')
prefix = "s3://million-song-dataset-yizhou/"
fileList = []
for obj in bucket.objects.filter( Prefix='TasteProfile/userIndex/').all():
    fileName = obj.key
    if fileName.startswith("TasteProfile/userIndex/part"):
        fileList.append(os.path.join(prefix,fileName))

# putItem
def putIntoDB(x):
    response = table.put_item(
        Item = {
            'user_id': x[0],
            'user_index': x[1]
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
def putUserIndexFile(fileName):
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
        out['PutRequest']['Item']['user_id'] = dict()
        out['PutRequest']['Item']['user_index'] = dict()
        out['PutRequest']['Item']['user_id']['S'] = dict()
        out['PutRequest']['Item']['user_index']['S'] = dict()
        out['PutRequest']['Item']['user_id']['S'] = x[0] 
        out['PutRequest']['Item']['user_index']['S'] = x[1]
        return out
    putList = list(map(transform,xlist))
    response = client.batch_write_item(
        RequestItems={
            'UserIdToIndex': putList
        }
    )
    unsuccessful = response['UnprocessedItems']
    if len(unsuccessful) == 0:
        return []
    else:
        return unsuccessful['UserIdToIndex']

    
def putBatchUserIndexFile(fileName, batchSize=25, times = 1.0):
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
        return [x['PutRequest']['Item']['user_id']['S'], x['PutRequest']['Item']['user_index']['S']]
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
    us = putBatchUserIndexFile(fileName, batchSize=25, times = times)
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