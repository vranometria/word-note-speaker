
// 削除可タグボタン
"use client";
import Tag from "../types/tag";
import TagView from "./tag-view";

interface TagViewProps {
    tag: Tag;
    isSelected: boolean;
    selected: () => void;
    deleted: () => void;
}

const DeletableTagView: React.FC<TagViewProps> = ({tag, isSelected=false, selected, deleted}) => {
    return (
        <div className="flex border-white border-double">
            <TagView tag={tag} isSelected={isSelected} selected={selected}></TagView>
            <button onClick={deleted} className={bindClasses("rounded", "bg-red-500", "text-white", "p-1", "m-1")}>
                x
            </button>
        </div>
    );
}

const bindClasses = (...classNames: string[]) => {
    return classNames.join(" ");
}

export default DeletableTagView;