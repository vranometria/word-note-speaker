"use client";

import { useRouter } from "next/navigation";
import Result from "../types/result";

import style from "./result-view.module.scss";
import Link from "next/link";

/**
 * props型定義
 */
interface ResultViewProps {
    results: Result[]|null;
    continueClicked: () => void;
}

/**
 * 回答結果表示コンポーネント
 * @param param0
 */
const ResultView: React.FC<ResultViewProps> = ({results, continueClicked}) => {
    const router = useRouter();

    const clickedContine = () => {
        continueClicked();
        router.push("/questions");
    };

    return (
        <div className="page-root">
            <main className="contents">
                <h1 className="page-title">Result</h1>

                <table className={style.result}>
                    <thead>
                        <tr>
                            <th>Question</th>
                            <th>Correct</th>
                            <th>Your Answer</th>
                            <th>Answer Count</th>
                            <th>Correct Count</th>
                            <th>Correct Ratio</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(results||[]).map((result, index) => (
                            <tr key={index}>
                                <td>{result.question.english}</td>
                                <td>{result.selection.isCorrect ? "◯" : "✖" }</td>
                                <td>{result.selection.text}</td>
                                <td>{result.question.answerCount}</td>
                                <td>{result.question.correctCount}</td>
                                <td>{result.question.ratio}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                    
                <div className="text-right w-full">
                    <a className="btn41-43 btn-41 text-center rounded w-full" onClick={clickedContine}>Continue</a>
                </div>

                <div className="back">
                    <Link href="/">HOME</Link>
                </div>
            </main>
        </div>
    );
}

export default ResultView;