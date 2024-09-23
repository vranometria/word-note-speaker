// 問題登録画面
"use client";
import { useContext, useEffect, useState } from "react"
import { AppContext } from "../AppContext"
import styles from "./page.module.css";
import Link from "next/link";
import TagView from "../parts/tag-view";
import { Tag } from "../types/tag";
import { bindClasses } from "../util";

export default function Register() {
    const context = useContext(AppContext);
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

    // formはsubmit時の送信禁止
    const submit = (event: React.FormEvent<HTMLFormElement>) => {event.preventDefault();};

    // english入力イベント
    const inputEnglish = (event: React.ChangeEvent<HTMLInputElement>) => {
        // 英数記号のみ入力可
        const value = event.target.value;
        if(value.match(/^[a-zA-Z0-9.,!? ]*$/)){
            setEnglish(value);
        }
    };

    // registerクリックイベント
    const clickedRegister = () => {
        const [isEnglishError, isJapaneseError] = checkInput(english, japanese);
        if(isEnglishError){
            setEnglishErr(styles.error);
        }
        if(isJapaneseError){
            setJapaneseErr(styles.error);
        }
        const success = !isEnglishError && !isJapaneseError;
        if(success){
            doRegister(context.questionUrl, english, japanese, tagIds)
            clear();
        }
    };

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

    return(
        <div className="page-root">
            <main className="contents">
                <h1 className="text-center pb-20 w-full">Question Registeration</h1>
                <form onSubmit={submit}>
                    <div className={styles.row}>
                        <div className={styles.label}>
                            English word
                        </div>
                        <div className={styles.input}>
                            <input type="text" value={english} className={classes(styles.in, englishErr)} onChange={ (e)=>{inputEnglish(e);} }/>
                        </div>
                    </div>            
                    <div className={styles.row}>
                        <div className={styles.label}>
                            Japanese meaning
                        </div>
                        <div>
                            <input type="text" value={japanese} className={classes(styles.in, japaneseErr)} onChange={(e)=>{setJapanese(e.target.value)}} />
                        </div> 
                    </div>
                    
                    <div className={styles.row}>
                        <div className={styles.label}>
                            Tags
                        </div>
                        <div className={bindClasses("tag-container", "pt-5 pb-5")}>
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
                                } )
                            }
                        </div>
                    </div>
                    <div className={bindClasses(styles.register_button, "common-button")}>
                        <button onClick={ ()=>{clickedRegister()}}>Register</button>
                    </div>
                    <div className="back">
                        <Link href="/">
                            <button>Back</button>
                        </Link>
                    </div>
                </form>
            </main>
        </div>
    );
}

const classes = (...clses:string[]) => clses.join(" ");

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

/**
 * 登録処理
 * @param url 
 * @param english 
 * @param japanese 
 * @param tags 
 */
const doRegister = async (url: string, english: string, japanese: string, tags: string[]) => {
    const body:string = JSON.stringify({
        english: english,
        japanese: japanese,
        tags: tags,
    });

    try {
        const response = await fetch(url, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: body
        });
    
        if(response.ok){
            alert("Registered");
        } else {
            alert("Failed to register");
        }
    }
    catch(e) {
        const exception = e as Error;
        alert(exception.message);
    };
}