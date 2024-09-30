"use client";
import { useEffect, useState } from "react";

import ConditionView from "./condition-view";
import QuestionView from "./question-view";
import ResultView from "./result-view";

import { IAnswer } from "../types/interfaces/answer";
import Result from "@/app/types/result";
import Question from "@/app/types/question";

import { fetchQuestions, patchScore } from "../apis";

/**
 * 問題収集～結果表示までの現在状態
 */
enum State {
    CONDITION,
    QUESTION,
    RESULT
}

/**
 * 問題選択・出題画面
 * @returns 
 */
export default function Start() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [answers, setAnswers] = useState<IAnswer[]|null>(null);
    const [results, setResults] = useState<Result[]|null>(null);

    const events = {
        // 出題開始ボタンクリック時の処理
        startClicked: async (condition:object) => {
            const qs = await fetchQuestions(condition);
            setQuestions(qs);
        },

        // 続けるボタンクリック時の処理
        continueClicked: () => {
            setQuestions([]);
            setAnswers(null);
            setResults(null);
        }
    }

    useEffect(() => {
        if(!answers) return;
        async function score() {
            const results = await patchScore(answers as IAnswer[]);
            setResults(results);
        }
        score();
    }, [answers]);

    const finished = (ans: object[]) => {setAnswers(ans as IAnswer[]);};

    // 問題データが無いときは条件入力画面を表示
    // 全回答結果があるときは結果表示画面を表示
    // 問題があって回答がない時は問題出題画面を表示
    const state = questions.length === 0 ? State.CONDITION : results ? State.RESULT : State.QUESTION;
    switch(state) {
        // 出題条件入力画面
        case State.CONDITION:
            return <ConditionView startClicked={events.startClicked} />;

        // 問題出題画面
        case State.QUESTION:
            return <QuestionView questions={questions} finished={finished}/>;

        // 結果表示画面
        case State.RESULT:
            return <ResultView results={results} continueClicked={events.continueClicked}/>
    }
}