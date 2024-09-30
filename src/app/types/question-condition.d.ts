/**
 * 検索条件クラス
*/
export default interface QuestionCondition {
    numberOfQuestions: number;
    rateFrom: number;
    rateTo: number;
    tagIds: string[];
}