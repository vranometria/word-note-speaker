"use client";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";

import { AppContext } from "@/app/AppContext";
import { Condition } from "@/app/types/condition";
import { Tag } from "@/app/types/tag";

import TagView from "@/app/parts/tag-view";

/**
 * props型定義
 */
interface ConditionViewProps {
    /**
     * スタートボタンクリック時のコールバック
     * @param condition 
     * @returns 
     */
    startClicked: (condition: Condition) => void;
}

/**
 * 問題選択条件入力コンポーネント
 * @param param0 
 * @returns 
 */
const ConditionView: React.FC<ConditionViewProps> = ({startClicked}) => {
    const context = useContext(AppContext);
    const [tags, setTags] = useState<Tag[]>([]);
    const [tagIds, setTagIds] = useState<string[]>([]);
    const [numberOfQuestions, setNumberOfQuestions] = useState<number>(5);

     // タグデータの取得
     useEffect(()=>{
        async function fetchData(){
            const res = await fetch(context.tagUrl);
            const json = await res.json();
            const body = JSON.parse(json.body);
            const ts = body.map((x:Tag) => {
                const t: Tag = {id: x.id, label: x.label};
                return t;
            });
            setTags(ts);
        };
        fetchData();
    }, []);

    // スタートボタンクリック時の処理
    const onClick = () => {
        const condition: Condition = {
            numberOfQuestions: numberOfQuestions,
            rateFrom: 0.0,
            rateTo: 1.0,
            tagIds: tagIds
        };
        startClicked(condition);
    }

    // [問題数]変更時の処理
    const changeNumberOfQuestions = (e:React.ChangeEvent<HTMLInputElement>) => {
        // 数字とバックスペース以外は無視
        if(e.target.value.match(/[^0-9]/)) {
            return;
        }
        // 0以下禁止
        if(Number(e.target.value) <= 0) {
            return;
        }
        setNumberOfQuestions(Number(e.target.value));
    }

    return (
        <div className="page-root">
            <main className="contents">
                <h1 className="page-title">Condition</h1>
                <div className="table">
                    <div className="table-row">
                        <label className="table-cell pr-10 py-6">Number of questions</label>
                        <input type="number" value={numberOfQuestions} className="rounded bg-white text-black p-1 table-cell w-20" onChange={changeNumberOfQuestions} />
                    </div>
                    <div className="table-row">
                        <label className="table-cell pr-10 py-6 text-right">Tags</label>
                        <div className="tag-container">
                            {
                                tags.map( (tag:Tag, index:number) => {
                                    const selected = (id:string) => {
                                        if(tagIds.includes(id)) {
                                            setTagIds(tagIds.filter((tagId:string) => id !== tagId));
                                        }
                                        else {
                                            setTagIds([...tagIds, id]);
                                        }
                                    };
                                    const isSelected = tagIds.includes(tag.id);
                                    return <TagView key={index} tag={tag} isSelected={isSelected} selected={selected}/>    
                                })
                            }
                        </div>
                    </div>
                </div>
                <div className="w-full mt-20">
                    <button className="common-button text-right w-full" onClick={onClick}>Start</button>
                </div>
                <div className="back">
                    <Link href="/">Back</Link>
                </div>
            </main>
        </div>
    );
}

export default ConditionView;