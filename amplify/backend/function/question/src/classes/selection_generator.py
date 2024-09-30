import os

class SelectionGenerator:
    """
    問題野はズレ選択肢を生成するクラス
    """
    
    def work(self, mode:str, english:str, japanese:str) -> list[str]:
        """
        選択肢を生成する
        """

        match mode:
            case "gemini":
                return self.generate_by_gemini(english, japanese)

        return self.generate_dummy(japanese)


    def generate_dummy(self, japanese:str) -> list[str]:
        """
        ダミーの選択肢を生成する
        """
        return [
        {
            "text": japanese,
            "isCorrect": True
        },
        {
            "text": "test1",
            "isCorrect": False
        },
        {
            "text": "test2",
            "isCorrect": False
        },
        {
            "text": "test3",
            "isCorrect": False
        }
    ]


    def generate_by_gemini(self, english:str, japanese:str) -> list[str]:
        """
        geminiを使って選択肢を生成する
        """
        import json
        import google.generativeai as genai

        genai.configure(api_key=os.environ["GEMINI_API_KEY"])
        gemini_pro = genai.GenerativeModel("gemini-pro")

        prompt = f"""
        英単語を和訳する問題を作成しています
        ・「{english}」の間違った和訳を３つ作成してください
        ・正解の選択肢は不要です
        ・「{english}」をカタカナにした和訳は除いてください
        ・「{japanese}」と同じ和訳は除いてください
        ・{{"selections": [和訳]}}の形式で返答してください
        """
        response = gemini_pro.generate_content(prompt)
        d = json.loads(response.text)

        return [
            {
                "text": japanese,
                "isCorrect": True
            },
            {
                "text": d["selections"][0],
                "isCorrect": False
            },
            {
                "text": d["selections"][1],
                "isCorrect": False
            },
            {
                "text": d["selections"][2],
                "isCorrect": False
            }
        ]