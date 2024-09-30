class Selection:
    """
    問題の選択肢を表すクラス
    """
    
    def __init__(self, d:dict) -> None:
        self.text = d["text"]
        self.is_correct = d["isCorrect"]

    def to_dict(self):
        return {
            "text": self.text,
            "isCorrect": self.is_correct
        }