import Question from "../question";
import Selection from "../selection";

export interface IAnswer {
    question: Question;
    selection: Selection;
}