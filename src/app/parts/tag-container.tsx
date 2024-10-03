"use client";

import { useState } from "react";

import { deleteTag } from "@/app/apis";
import Tag from "@/app/types/tag";
import TagView from "./tag-view";
import Spinner from "./spinner";
import DeletableTagView from "./deletable-tag-view";


interface TagContainerProps {
    tags: Tag[];
    isDeletable?: boolean;
    isLoading: boolean;
    tagSelected: (ids:string[]) => void;
    tagDeleted?: (id:string) => void;
}

const TagContainer: React.FC<TagContainerProps> = ({tags, tagSelected, tagDeleted, isDeletable, isLoading}) => {
    const [tagIds, setTagIds] = useState<string[]>([]);

    const events = {
        selected: (id:string) => {
            if(tagIds.includes(id)){
                setTagIds(tagIds.filter( (tagId) => tagId !== id ));
            }else{
                setTagIds([...tagIds, id]);
            }
            tagSelected(tagIds);
        },

        // タグ削除ボタンクリックイベント 
        deleteTagClicked: async (id:string) => {
            const isSuccess = await deleteTag(id);
            if(isSuccess){
                if(tagDeleted){
                    tagDeleted(id);
                }
            }
        }
    }

    if(isLoading){
        return(<div className="pl-10"><Spinner></Spinner></div>)
    }

    if(tags.length === 0){
        return <div>No Tags</div>
    }

    return (
        <div className="tag-container">
            {
                tags.map( (tag:Tag, index:number) => {
                    const selected = () => { events.selected(tag.id) };
                    const deleted = () => { events.deleteTagClicked(tag.id) };
                    const isSelected = tagIds.includes(tag.id);
                    if(isDeletable){
                        return(<DeletableTagView key={index} tag={tag} isSelected={isSelected} selected={selected} deleted={deleted}/>)
                    }
                    else {
                        return(<TagView key={index} tag={tag} isSelected={isSelected} selected={selected} />)
                    }
                })
            }
        </div>
    );
}

export default TagContainer;