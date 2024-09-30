from .question import Question
from .selection import Selection

class Answer:
    def __init__(self, hash:dict) -> None:
        self.question = Question(hash["question"])
        self.selection = Selection(hash["selection"])