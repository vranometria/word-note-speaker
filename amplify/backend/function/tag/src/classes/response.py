import json
from decimal import Decimal

def decimal_to_int(obj):
    if isinstance(obj, Decimal):
        return int(obj)
    if hasattr(obj, "to_dict"):
        return obj.to_dict()
    return obj

class Response:
    def __init__(self, status_code, headers, body):
        self.status_code = status_code
        self.headers = headers
        self.body = body

    def to_dict(self):
        return {
            "statusCode": self.status_code,
            "headers": self.headers,
            "body": json.dumps(self.body, default=decimal_to_int)
        }
    
class SuccessResponse(Response):
    def __init__(self, headers=None, body={}):
        if headers is None:
            headers = {
                "Content-Type": "application/json",
                "Access-Control-Allow-Headers": 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent',
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": 'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT'    
            }
        super().__init__(200, headers, body)