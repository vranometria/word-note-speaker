"use client";
import { useEffect, useState } from "react"
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

import styles from "./page.module.css";

import TagView from "../parts/tag-view";
import Tag from "../types/tag";
import { bindClasses } from "../util";
import { fetchTags, registerQuestion } from "../apis";

/**
 * 問題登録画面
 * @returns 
 */
export default function Register() {
    const [english, setEnglish] = useState("");
    const [japanese, setJapanese] = useState("");
    const [tagIds, setTagIds] = useState<string[]>([]);
    const [englishErr, setEnglishErr] = useState("");
    const [japaneseErr, setJapaneseErr] = useState("");
    const [tags, setTags] = useState<Tag[]>([]);

     // 画面を初期化
     const clear = () => {
        setEnglishErr("");
        setJapaneseErr("");
        setTagIds([]);
        setEnglish("");
        setJapanese("");
    }

    const events = {
        // english入力イベント
        inputEnglish: (event: React.ChangeEvent<HTMLInputElement>) => {
            // 英数記号のみ入力可
            const value = event.target.value;
            if(value.match(/^[a-zA-Z0-9.,!? ]*$/)){
                setEnglish(value);
            }
        },
        // registerクリックイベント
        registerClicked: async () => {
            const [isEnglishError, isJapaneseError] = checkInput(english, japanese);
            if(isEnglishError){
                setEnglishErr(styles.error);
            }
            if(isJapaneseError){
                setJapaneseErr(styles.error);
            }
            const isNoError = !isEnglishError && !isJapaneseError;
            if(isNoError){
                const promise = registerQuestion(english, japanese, tagIds);
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
                    clear();
                }
            }
        }
    }

    // タグデータの取得
    useEffect(()=>{
        async function fetchData(){
            const ts = await fetchTags();
            setTags(ts);
        };
        fetchData();
    }, []);

    return(
        <div className="page-root">
            <main className="contents">
                <h1 className="text-center pb-20 w-full">Question Registeration</h1>
                <div className="table">
                    <div className="table-row">
                        <div className={styles.label}>
                            English word
                        </div>
                        <div className={styles.input}>
                            <input type="text" value={english} className={bindClasses(styles.in, englishErr)} onChange={ (e)=>{events.inputEnglish(e);} }/>
                        </div>
                    </div>            
                    <div className="table-row">
                        <div className={styles.label}>
                            Japanese meaning
                        </div>
                        <div className="table-cell">
                            <input type="text" value={japanese} className={bindClasses(styles.in, japaneseErr)} onChange={(e)=>{setJapanese(e.target.value)}} />
                        </div> 
                    </div>
                    
                    <div className="table-row">
                        <div className={styles.label}>
                            Tags
                        </div>
                        <div className="tag-container pt-5 pb-5 table-cell">
                            {
                                tags.map( (tag:Tag, index:number) => {
                                    const selected = (id:string) => {
                                        if(tagIds.some(x => id === x)){
                                            setTagIds(tagIds.filter(x => x !== id));
                                        }
                                        else{
                                            setTagIds([...tagIds, id]);
                                        }
                                    }
                                    return <TagView key={index} tag={tag} isSelected={tagIds.includes(tag.id)} selected={selected} />
                                })
                            }
                        </div>
                    </div>
                </div>
                <div className={bindClasses(styles.register_button, "w-full")}>
                    <a className="btn41-43 btn-41 w-full text-center rounded" onClick={events.registerClicked}>Register</a>
                </div>
                <div className="back">
                    <Link href="/">
                        <button>Back</button>
                    </Link>
                </div>
                <div><Toaster/></div>
            </main>
        </div>
    );
}

/**
 * 入力チェック
 * @param english 
 * @param japanese 
 * @param setEnglishErr 
 * @param setJapaneseErr 
 * @returns OKのときfalse
 */
const checkInput = (english: string, japanese: string) => {
    let isEnglishError:boolean = false;
    let isJapaneseError:boolean = false;

    if(!english){
        isEnglishError = true;
    }

    if(!japanese){
        isJapaneseError = true;
    }

    return [isEnglishError, isJapaneseError]
}
