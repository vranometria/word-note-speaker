// タグ編集画面
"use client";
import { useEffect, useState } from "react"
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

import style from "./page.module.css";

import { bindClasses } from "../util";
import Tag from "@/app/types/tag";
import TagContainer from "@/app/parts/tag-container";
import { fetchTags, putTag } from "@/app/apis";

/**
 * タグ編集画面
 * @returns タグ編集画面コンポーネント
 */
export default function Tags() {
    const [label, setTag] = useState<string>("");
    const [id, setId] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [isLoading, setLoading] = useState<boolean>(true);
    const [tags, setTags] = useState<Tag[]>([]);

    // タグデータの取得
    useEffect(()=>{
        async function fetchData(){
            const ts = await fetchTags();
            setTags(ts);
            setLoading(false);
        };
        fetchData();
    }, []);

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
    }

    const tagDeleted = (deletedId: string) => {
        setTags(tags.filter(x => x.id !== deletedId));
    }

    return (
        <div className="page-root">
            <main className="contents">
                <h1 className="page-title">Tag Edit</h1> 
                {/* Enterで登録できる様にformにする */}             
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
                        <div className="pl-10">
                            <TagContainer tags={tags} tagSelected={()=>{}} isDeletable={true} isLoading={isLoading} tagDeleted={tagDeleted}/>
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