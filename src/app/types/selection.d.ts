/**
 * 回答選択肢のクラス
 */
export default class Selection {
    text: string;
    isCorrect: boolean;

    toObject() {
        return {
            text: this.text,
            isCorrect: this.isCorrect
        }
    }
}