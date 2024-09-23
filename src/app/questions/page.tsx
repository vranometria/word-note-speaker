"use client";
import { AppContext } from "@/app/AppContext";
import { useContext, useEffect, useState } from "react";
import ConditionView from "./condition-view";
import { Condition } from "@/app/types/condition";
import QuestionView from "./question-view";
import Answer from "../types/answer";
import ResultView from "./result-view";
import Result from "../types/result";
import styles from "./page.module.scss";

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
    const context = useContext(AppContext);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState<Answer[]|null>(null);
    const [results, setResults] = useState<Result[]|null>(null);

    // 出題開始ボタンクリック時の処理
    const startClicked = async (condition:Condition) => {
        const conditionBody = JSON.stringify({condition: condition});
        const res = await fetch(context.questionUrl,{
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: conditionBody
        })
        const jsonRes = await res.json();
        const body = JSON.parse(jsonRes.body);
        setQuestions(body.questions);
    };

    useEffect(() => {
        if(!answers) return;
        async function patchAnswers() {
            const answerBody = JSON.stringify({answers: answers});
            const res = await fetch(context.questionUrl, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: answerBody
            });
            const jsonRes = await res.json();
            const body = JSON.parse(jsonRes.body);
            setResults(body.results);
        }
        patchAnswers();
    }, [answers, context.questionUrl]);

    const finished = (ans: Answer[]) => {setAnswers(ans);};

    const continueClicked = () => {
        setQuestions([]);
        setAnswers(null);
        setResults(null);
    }

    // 問題データが無いときは条件入力画面を表示
    // 全回答結果があるときは結果表示画面を表示
    // 問題があって回答がない時は問題出題画面を表示
    const state = questions.length === 0 ? State.CONDITION : results ? State.RESULT : State.QUESTION;
    switch(state) {
        // 出題条件入力画面
        case State.CONDITION:
            return <ConditionView startClicked={startClicked} />;

        // 問題出題画面
        case State.QUESTION:
            return <QuestionView questions={questions} finished={finished}/>;

        // 結果表示画面
        case State.RESULT:
            return <ResultView results={results} continueClicked={continueClicked}/>
    }
}