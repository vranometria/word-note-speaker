// タグ編集画面
"use client";
import { useState, useEffect } from "react"
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

import style from "./page.module.css";

import DeletableTagView from "../parts/deletable-tag-view";
import { bindClasses } from "../util";
import Tag from "../types/tag";
import { fetchTags, putTag, deleteTag } from "../apis";

/**
 * タグ編集画面
 * @returns タグ編集画面コンポーネント
 */
export default function Tags() {
    const [label, setTag] = useState<string>("");
    const [id, setId] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [tags, setTags] = useState<Tag[]>([]);

    // 画面初期化関数
    const clear = () => {
        setTag("");
        setId("");
        setError("");
    };

    // ボタンクリックイベント
    const events = {
        // 登録ボタンクリックイベント
        registerClicked: async () => {
            if(!label){
                setError(style.error);
                return;
            }
    
            const tag: Tag = {
                id: id,
                label: label
            };

            const promise = putTag(tag);
            toast.promise(
                promise,
                {
                   loading: 'Saving...',
                   success: <b>Settings saved!</b>,
                   error: <b>Could not save.</b>,
                }
            );
            const isSuccess = await promise;
            if(isSuccess){
                tags.push(tag);
                setTags(tags);
                clear();
            }
        },

        // タグ削除ボタンクリックイベント 
        deleteTagClicked: async (id:string) => {
            const isSuccess = await deleteTag(id);
            if(isSuccess){
                const ts = tags.filter(x => x.id !== id);
                setTags(ts);
            }
        }
    }

     // タグ情報をすべて取得
    useEffect(()=>{
        async function fetchData(){
            const ts = await fetchTags();
            setTags(ts);
        };
        fetchData();
    }, []);


    return (
        <div className="page-root">
            <main className="contents">
                <h1 className="page-title">Tag Edit</h1>

                <form onSubmit={(e)=>{e.preventDefault();}} >
                    <div className="flex">
                        <label className="pr-10 mt-4">Tag Name</label>
                        <input type="hidden" name="id" value={id}/>
                        <input type="text" className={bindClasses(style["tag-name"], error, "mt-3 mb-2")} value={label} onChange={(e)=>{setTag(e.target.value);}}/>
                        <a className="btn41-43 btn-41 text-center rounded" onClick={events.registerClicked}>+</a>
                    </div>
                </form>

                <div className="mt-20">
                    <div>
                        <h2>Tags</h2>
                        <div className="tag-container">
                            {tags.map((x:Tag) => {
                                return <DeletableTagView key={x.id} tag={x} isSelected={false} selected={()=>{}} deleted={()=>{events.deleteTagClicked(x.id)}}></DeletableTagView>;
                            })}
                        </div>
                    </div>
                </div>
                <div className="back">
                    <Link href="/">Back</Link>
                </div>
                <div><Toaster/></div>
            </main>
        </div>
    );
}