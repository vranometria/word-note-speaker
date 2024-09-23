import Question from "./question";
import Selection from "./selection";

export default interface Result {
    question: Question;
    selection: Selection;
}