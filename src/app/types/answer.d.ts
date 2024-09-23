import Question from "./question";
import Selection from "./selection";

export default interface Answer {
    question: Question;
    selection: Selection;
}