import json
import boto3
import uuid
import os
from classes.response import SuccessResponse

ENDPOINT_URL = os.environ.get("ENDPOINT_URL")
TABLE_NAME = os.environ.get("TABLE_NAME")

dynamodb = boto3.resource('dynamodb', endpoint_url=ENDPOINT_URL) if ENDPOINT_URL == None else boto3.resource('dynamodb')
table = dynamodb.Table(TABLE_NAME)

def handler(event, context):
    action = event.get("httpMethod")

    if action == "PUT":
        body = event.get("body")
        body_json = json.loads(body)

        id = body_json.get("id")
        if id == None:
            id = ""
        label = body_json["label"]
        return put_data(id, label)
    elif action == "GET":
        return get_data()
    elif action == "DELETE":
        id = event["pathParameters"]["proxy"]
        return delete_data(id)
    
    res = SuccessResponse(body={"message":"no work"})
    return res.to_dict()


def put_data(id, label):
    tag_id = id
    if tag_id == "":
        tag_id = uuid.uuid4().hex

    item = { "id": tag_id, "label": label }
    table.put_item(Item=item)

    body = {
        "message": "Data inserted successfully",
        "id": id,
        "label": label,
    }

    return SuccessResponse(body=body).to_dict()

def get_data():
    response = table.scan()
    items = response['Items']
    return SuccessResponse(body=items).to_dict()

def delete_data(id):
    table.delete_item(Key={"id": id})
    return SuccessResponse(body={"message":"Data deleted successfully"}).to_dict()