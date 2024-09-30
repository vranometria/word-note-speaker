class Question:
    def __init__(self, hash:dict) -> None:
        self.id = hash["id"]
        self.english = hash["english"]
        self.japanese = hash["japanese"]
        self.answerCount = hash.get("answerCount")
        self.correctCount = hash.get("correctCount")
        self.ratio = hash.get("ratio")
        self.tags = hash.get("tags")

    def to_dict(self):
        return {
            "id": self.id,
            "english": self.english,
            "japanese": self.japanese,
            "answerCount": self.answerCount,
            "correctCount": self.correctCount,
            "ratio": self.ratio,
            "tags": self.tags
        }