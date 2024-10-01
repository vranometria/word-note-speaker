"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

import { Api } from "@/app/apis";
import Question from "@/app/types/question";

import style from "./page.module.scss";


export default function QuestionList() {
    const [questions, setQuestions] = useState<Question[]>([]);

    useEffect(() => {
        async function fetchQuestionList() {
            const qs = await Api.fetchQuestionList();
            setQuestions(qs);
        }
        fetchQuestionList();
    }, []);

    return (
        <div className="page-root">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                <h1 className="page-title">Question List</h1>
                <table className={style.question_list}>
                    <thead>
                        <tr>
                            <th>English</th>
                            <th>Japanese</th>
                        </tr>
                    </thead>
                    <tbody>
                        {questions.map((question, index) => (
                            <tr key={index}>
                                <td>{question.english}</td>
                                <td>{question.japanese}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="back">
                    <Link href="/">Back</Link>
                </div>
            </main>
        </div>
    );
}