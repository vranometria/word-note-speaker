import Selection from "@/app/types/selection";

export default class Question {
    id: string;
    english: string;
    japanese: string;
    selections: Selection[];
    answoer: string;
    answerCount: number;
    correctCount: number;
    ratio: number;
    tags: string[];

    toObject() {
        return {
            id: this.id,
            english: this.english,
            japanese: this.japanese,
            selections: this.selections.map(s => s.toObject()),
            answer: this.answer,
            answerCount: this.answerCount,
            correctCount: this.correctCount,
            ratio: this.ratio,
            tags: this.tags
        }
    }
}