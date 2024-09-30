import { get, post, patch, put, ApiError, del } from '@aws-amplify/api';

import Tag from '@/app/types/tag';
import Question from '@/app/types/question';
import {IAnswer} from './types/interfaces/answer';
import Result from '@/app/types/result';
import QuestionCondition from './types/question-condition';

/**
 * APIエラー時の処理
 * @param e 
 */
const error = (e: unknown): void => {
    const error = e as ApiError;
    alert(error.message);
    console.log(error);
}

/**
 * 登録済みのタグをすべて取得する
 * @returns
 */
export async function fetchTags(): Promise<Tag[]> {
    let tags: Tag[] = [];
    try {
        const operation = get({apiName: 'tag', path: '/tags'});
        const { body } = await operation.response;
        const res = await body.text();
        if(res){
            tags = JSON.parse(res).map((x:Tag) => {
                const t: Tag = {id: x.id, label: x.label};
                return t;
            });
        }
    }
    catch(e) { error(e); };
    return tags;
}


/**
 * DBにタグを登録
 */
export async function putTag(tag: Tag): Promise<boolean>{
    try {
        const operation = put({
            apiName: 'tag',
            path: '/tags',
            options: {
                body: {label: tag.label, id: tag.id}
            }
        });

        const response = await operation.response;

        if(response.statusCode === 200){
            return true;
        } else {
            alert("登録に失敗しました");
            console.log(response.body);
            return false;
        }
    }
    catch (e) {
        error(e);
        return false;
    }
}


/**
 * DBからタグを削除
 */
export async function deleteTag(id: string): Promise<boolean>{
    try {
        const operation = del({
            apiName: 'tag', 
            path: '/tags/' + id,
        });
        const response = await operation.response;
        if(response.statusCode === 200){
            return true;
        } else {
            alert("削除に失敗しました");
            console.log(response);
            return false;
        }
    }
    catch (e) {
        error(e);
        return false;
    }
}

/**
 * 問題を検索する
 * @param condition 
 * @returns 
 */
export async function fetchQuestions(condition: object): Promise<Question[]> {
    const v = condition as QuestionCondition;
    let questions: Question[] = [];
    try {
        const operation = post({
            apiName: 'words',
            path    : '/questions',
            options: {
                body: {
                    condition: {
                        numberOfQuestions: v.numberOfQuestions,
                        rateFrom: v.rateFrom,
                        rateTo: v.rateTo,
                        tagIds: v.tagIds
                    }
                }
            }
        });
    
        const { body } = await operation.response;
        const res = await body.text();
        if(res){
            const body = JSON.parse(res);
            questions = body.questions;
        }
        else {
            alert("Failed to fetch questions");
        }
    }
    catch(e) { 
        error(e); 
    };

    return questions;
}

/**
 * 正答率の更新
 * @param answers
 * @returns 
 */
export async function patchScore(answers: IAnswer[]): Promise<Result[]> {
    let results: Result[] = [];
    try {
        const operation = patch({
            apiName: 'words',
            path: "/questions",
            options: {
                body: {
                    answers: answers.map(x=>{
                        return { 
                            question: {
                                id: x.question.id, 
                                english: x.question.english, 
                                japanese: x.question.japanese, 
                            }, 
                            selection: {
                                text: x.selection.text, 
                                isCorrect: x.selection.isCorrect, 
                            },
                        }
                    })
                }
            }
        });
        const { body } = await operation.response;
        const res = await body.text();
        if(res){
            const body = JSON.parse(res);
            results = body.results;
        }
        else {
            alert("Failed to fetch questions");
        }
    }
    catch(e) { 
        error(e); 
    };
    return results;
}

export interface IApi {
    registerQuestion: (english: string, japanese: string, tags: string[]) => Promise<boolean>;
}

abstract class AbstractApi implements IApi {
    abstract registerQuestion: (english: string, japanese: string, tags: string[]) => Promise<boolean>;
    
    getRegisterQuestionBody = (english: string, japanese: string, tags: string[]) => {
        return {
            english: english,
            japanese: japanese,
            tags: tags,
        }
    }
}


class ProductionApi extends AbstractApi {
    /**
     * 問題登録
     * @param english 英語
     * @param japanese 正解の日本語
     * @param tags 問題二関連するタグ
     */
    registerQuestion = async (english: string, japanese: string, tags: string[]): Promise<boolean> => { 
        try {
            const operation = put({
                apiName: 'words',
                path: '/questions',
                options: { body: this.getRegisterQuestionBody(english, japanese, tags) }
            });
            const response = await operation.response;
        
            if(response.statusCode === 200){
                return true;
            } else {
                alert("Failed to register");
                return false;
            }
        }
        catch(e) { 
            error(e);
            return false;
        };
    }
}

class DevelopmentApi extends AbstractApi {
    registerQuestion = async (english: string, japanese: string, tags: string[]): Promise<boolean> =>  {
        try {
            const url = `${process.env.NEXT_PUBLIC_QUESTION_ENDPOINT}`;
            const res = await fetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.getRegisterQuestionBody(english, japanese, tags)),
            });
            if(res.status === 200){
                return true;
            } else {
                alert("Failed to register");
                return false;
            }
        }
        catch(e) { 
            error(e);
            return false;
        };
    }
}

let apiClass;

switch (process.env.NODE_ENV) {
    case 'development':
        apiClass = new DevelopmentApi();
    
    case 'production':
        apiClass = new ProductionApi();

    default:
        apiClass = new DevelopmentApi();
}

export const Api = apiClass;