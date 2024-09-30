class Condition:
    def __init__(self, d:dict):
        self.number_of_questions = d.get("numberOfQuestions") or 15
        self.rate_from = d.get("rateFrom") or 0
        self.rate_to = d.get("rateTo") or 100
        self.tag_ids = d.get("tagIds") or []