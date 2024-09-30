import boto3
import os
import random
import uuid
import json
import datetime
from decimal import Decimal
from classes.response import SuccessResponse
from classes.condition import Condition
from classes.answer import Answer
from classes.question import Question
from classes.result import Result
from classes.selection_generator import SelectionGenerator
from classes.scan_condition import ScanCondition

TABLE_NAME = os.environ["TABLE_NAME"]
ENDPOINT_URL = os.environ.get("ENDPOINT_URL")

dynamodb = boto3.resource('dynamodb') if ENDPOINT_URL == None else boto3.resource('dynamodb', endpoint_url=ENDPOINT_URL)
table = dynamodb.Table(TABLE_NAME)

def handler(event, context):
    action = event.get("httpMethod")
    if action == "PUT":
        # putメソッドの時は登録処理を行う
        body = json.loads(event["body"])
        english = body["english"]
        japanese = body["japanese"]
        tags = body.get("tags") or []
        return put_data(english, japanese, tags)
    elif action == "POST":
        # postメソッドの時は問題を取得する
        body = json.loads(event["body"])
        condition = Condition(body["condition"])
        return get_data(condition)
    elif action == "PATCH":
        body = json.loads(event["body"])
        # patchメソッドの時は正答率を計算する
        answers = list(map(lambda d: Answer(d), body["answers"]))
        return calculate_score(answers)

    res = SuccessResponse(body={"message":"no work"})
    return res.to_dict()


def put_data(english, japanese, tags):
    """
    データを登録する
    """
    id = uuid.uuid4().hex
    date = datetime.datetime.now().strftime('%Y%m%d')
    item = { "id": id, "english": english, "japanese": japanese, "tags": tags, "answerCount": 0, "correctCount": 0, "ratio": 0,"createdAt": date}
    table.put_item(Item=item)
    body = {
        "message": "Data inserted successfully",
        "english": english,
        "japanese": japanese,
        "tags": tags,
    }

    return SuccessResponse(body=body).to_dict()


def get_data(condition:Condition):
    """
    Questionを取得する
    """
    scan_condition = ScanCondition()
    scan_condition.tag_ids = condition.tag_ids
    scan_condition.build()
    scan_condition.print()
    response = None
    if len(scan_condition.filter_expression) > 0:
        response = table.scan(
            FilterExpression = scan_condition.filter_expression,
            ExpressionAttributeValues = scan_condition.attribute_values
        )
    else:
        response = table.scan()

    items = response['Items']

    # 問題数が指定されている時は指定数の問題を返す
    if condition.number_of_questions and condition.number_of_questions < len(items):
        items = items[:condition.number_of_questions]

    questions = list(map(lambda item: createQuestion(item), items))
    random.shuffle(questions)

    body = {"questions": questions}
    return SuccessResponse(body=body).to_dict()


def createQuestion(item):
    """
    問題構造体を生成する
    """

    selections = SelectionGenerator().work("gemini", item["english"], item["japanese"])
    random.shuffle(selections)

    return {
        "id": item["id"],
        "english": item["english"],
        "japanese": item["japanese"],
        "selections": selections
    }


def calculate_score(answers):
    """
    正答率を計算する
    """
    ids = list(map(lambda x: x.question.id, answers))
    response = dynamodb.batch_get_item(
        RequestItems={
            TABLE_NAME: {
                'Keys': [
                    {'id': id} for id in ids
                ]
            }
        }
    )
    items = response.get('Responses', {}).get(TABLE_NAME, [])

    results = []

    for answer in answers:
        # itemsからidが一致するものを取得
        item = next(filter(lambda x: x["id"] == answer.question.id, items))
        item["answerCount"] += 1
        if answer.selection.is_correct:
            item["correctCount"] += 1
        item["ratio"] = item["correctCount"] / item["answerCount"] * 100
        update_result(item["id"], item["answerCount"], item["correctCount"], item["ratio"])
        item["ratio"] = float(item["ratio"])

        question = Question(item)
        selection = answer.selection
        results.append(Result(question, selection))
    
    return SuccessResponse(body={"results": results}).to_dict()


def update_result(id:str, answerCount:int, correctCount:int, ratio:float):
    """
    正答率を更新する
    """
    response = table.update_item(
        Key = { 'id': id },
        UpdateExpression = "SET answerCount = :col1, correctCount = :col2,  ratio = :col3",
        ExpressionAttributeValues = {
            ':col1': answerCount,
            ':col2': correctCount,
            ':col3': Decimal(ratio)
        }
    )