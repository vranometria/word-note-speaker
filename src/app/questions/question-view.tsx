"use client";
import Image from "next/image";
import { useState } from "react";

import Question from "@/app/types/question";
import Selection from "@/app/types/selection";
import { bindClasses } from "@/app/util";

import style from './question-view.module.scss';

interface QuestionViewProps {
    questions: Question[];
    finished: (answers:object[]) => void;
}

const QuestionView: React.FC<QuestionViewProps> = ({questions, finished}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<object[]>([]);
    const [speaking, setSpeaking] = useState("");
    const [selectionVisiblity, setSelectionVisiblity] = useState<string>("hide");

    const currentQuestion = questions[currentIndex];
    const currentNo = currentIndex + 1;
    const maxNo = questions.length;

    const events = {
        // 回答を選択した時、次の問題に進む
        // 最後の問題を回答した時、全回答を親画面に返す
        selectionClicked : (selection:Selection) => {
            const answer = {
                question: currentQuestion,
                selection: selection
            };
            
            setAnswers([...answers, answer]);
            setSelectionVisiblity("hide");
            
            if(currentIndex === questions.length - 1) {
                finished([...answers, answer]);
            }
            else{
                setCurrentIndex(currentIndex + 1);
            }
        },
        // スピーカーアイコンをクリックすると英単語を読み上げる
        speakerClicked : () => {
            setSpeaking(style.speaking);
            const text = currentQuestion.english;
            const uttearnce = new SpeechSynthesisUtterance();
            uttearnce.text = text;
            uttearnce.volume = 1;
            uttearnce.rate = 1;
            uttearnce.pitch = 1;
            uttearnce.lang = 'en-US';
            uttearnce.onend = () => { setSpeaking(""); };
            speechSynthesis.speak(uttearnce);
            setSelectionVisiblity("show");
        }
    }

    return (
        <div className="page-root">
            <main className="contents">
                <h2 className="page-title">{currentNo}/{maxNo}</h2>

                <div onClick={events.speakerClicked}>
                    <Image src="/speaker.png" alt="question" width={200} height={200} className={speaking}/>
                </div>

                <div className={bindClasses("selections", selectionVisiblity)}>
                    {
                        currentQuestion.selections.map((value:Selection, index:number) => {
                            return(
                                <div key={index}>
                                    <button onClick={() => {events.selectionClicked(value)}} className="common-button w-auto p-5 m-1 ">{value.text}</button>
                                </div>
                            );
                        })
                    }
                </div>
            </main>
        </div>
    );
};

export default QuestionView;