import boto3

def lambda_handler(event, context):
    identityId = str(event['identityId'])
    client = boto3.client('dynamodb')
    response = client.get_item(
            TableName="identityIdToUserID",
            Key={
                'identityId' : {'S': identityId}
            },
            AttributesToGet = ["user_id"]
        )
    user_id = response["Item"]["user_id"]["S"]
    return user_id
