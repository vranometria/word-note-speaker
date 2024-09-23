// タグ編集画面
"use client";
import style from "./page.module.css";
import { useContext, useState, useEffect } from "react"
import { AppContext } from "../AppContext"
import DeletableTagView from "../parts/deletable-tag-view";
import Link from "next/link";
import { bindClasses } from "../util";

interface Tag {
    id: string;
    label: string;
}

export default function Tags() {
    const context = useContext(AppContext);
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

    // 登録ボタンクリックイベント
    const clickedRegister = () => {
        if(!label){
            setError(style.error);
            return;
        }

        const tag: Tag = {
            id: id,
            label: label
        };

        putTag(context.tagUrl, tag);
        tags.push(tag);
        setTags(tags);
        clear();
    }

     // タグ情報をすべて取得
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

    // タグ削除ボタンクリックイベント 
    const deleteTagClicked = (id:string) => {
        const ts = tags.filter(x => x.id !== id);
        setTags(ts);
        deleteTag(context.tagUrl, id);
    };

    return (
        <div className="page-root">
            <main className="contents">
                <h1 className="page-title">Tag Edit</h1>

                <form onSubmit={(e)=>{e.preventDefault();}} >
                    <div className="flex">
                        <label className="pr-10 mt-4">Tag Name</label>
                        <input type="hidden" name="id" value={id}/>
                        <input type="text" className={bindClasses(style["tag-name"], error, "mt-3 mb-2")} value={label} onChange={(e)=>{setTag(e.target.value);}}/>
                        <button className="common-button" onClick={clickedRegister}>+</button>
                    </div>
                </form>

                <div className="mt-20">
                    <div>
                        <h2>Tags</h2>
                        <div className="tag-container">
                            {tags.map((x:Tag) => {
                                return <DeletableTagView key={x.id} tag={x} isSelected={false} selected={()=>{}} deleted={()=>{deleteTagClicked(x.id)}}></DeletableTagView>;
                            })}
                        </div>
                    </div>
                </div>
                <div className="back">
                    <Link href="/">Back</Link>
                </div>
            </main>
        </div>
    );
}

// DBにタグを登録
const putTag = async (url:string, tag: Tag) => {
    try {
        const response = await fetch(url, {
            method: 'PUT',
            body: JSON.stringify({label: tag.label, id: tag.id}),
            headers: { 'Content-Type': 'application/json' }
        });
        if(response.ok){
        } else {
            alert("登録に失敗しました");
        }
    }
    catch (error) {
        const e = error as Error;
        alert("inner error " + e.message);
    }
}

// DBからタグを削除
const deleteTag = async (url:string, id: string) => {
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            body: JSON.stringify({id: id}),
            headers: { 'Content-Type': 'application/json' }
        });
        if(response.ok){
        } else {
            alert("削除に失敗しました");
        }
    }
    catch (error) {
        const e = error as Error;
        alert("inner error " + e.message);
    }
}