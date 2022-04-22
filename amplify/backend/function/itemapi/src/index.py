import awsgi
import os
from uuid import uuid4
from flask import Flask, jsonify, request
from flask_cors import CORS

import boto3


app = Flask(__name__)
CORS(app)


# setup db
client = boto3.client("dynamodb")
ITEM_TABLE = os.environ.get("STORAGE_ITEMSTORAGE_NAME")

# Constant variable with path prefix
BASE_ROUTE = "/item"

# GET ALL ITEMS
@app.route(BASE_ROUTE, methods=['GET'])
def list_items():
    ret = jsonify(data=client.scan(TableName=ITEM_TABLE))
    return ret

# CREATE ITEM
@app.route(BASE_ROUTE, methods=['POST'])
def create_item():
    request_json = request.get_json() # {'name': 'Item #1'}
    client.put_item(TableName=ITEM_TABLE, Item={
        'id': {'S': str(uuid4())},
        'name': {'S': request_json.get("name")},
    })
    return jsonify(message="item created")

# GET SPECIFIC
@app.route(BASE_ROUTE + '/<item_id>', methods=['GET'])
def get_item(item_id):
    item = client.get_item(TableName=ITEM_TABLE, Key={
        'id': {
            'S': item_id
        }
    })
    return jsonify(data=item)

# UPDATE
@app.route(BASE_ROUTE + '/<item_id>', methods=['PUT'])
def update_item(item_id):
    client.update_item(
        TableName=ITEM_TABLE,
        Key={'id': {'S': item_id}},
        UpdateExpression='SET #name = :name',
        ExpressionAttributeNames={'#name': 'name'},
        ExpressionAttributeValues={':name': {'S': request.json['name']}}
    )
    return jsonify(message="item updated")

# DELETE
@app.route(BASE_ROUTE + '/<item_id>', methods=['DELETE'])
def delete_item(item_id):
    client.delete_item(
        TableName=ITEM_TABLE,
        Key={'id': {'S': item_id}}
    )
    return jsonify(message="item deleted")


def handler(event, context):
    return awsgi.response(app, event, context)
