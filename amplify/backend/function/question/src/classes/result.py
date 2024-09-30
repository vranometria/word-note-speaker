from .question import Question
from .selection import Selection

class Result:
    """回答結果を表すクラス"""
    
    def __init__(self, question:Question, selection:Selection) -> None:
        self.question = question
        self.selection = selection

    def to_dict(self):
        return {
            "question": self.question.to_dict(),
            "selection": self.selection.to_dict()
        }