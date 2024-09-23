import Selection from "@/app/types/selection";

export default interface Question {
    id: string;
    english: string;
    japanese: string;
    selections: Selection[];
    answoer: string;
    answerCount: number;
    correctCount: number;
    ratio: number;
    tags: string[];
}