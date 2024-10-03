
// 削除可タグボタン
"use client";
import Tag from "../types/tag";
import TagView from "./tag-view";

interface TagViewProps {
    tag: Tag;
    isSelected: boolean;
    selected: (id: string) => void;
    deleted: (id: string) => void;
}

const DeletableTagView: React.FC<TagViewProps> = ({tag, isSelected=false, selected, deleted}) => {
    const events = {
        deleted: () => {
            deleted(tag.id);
        }
    }

    return (
        <div className="flex border-white border-double">
            <TagView tag={tag} isSelected={isSelected} selected={selected}></TagView>
            <button onClick={events.deleted} className={bindClasses("rounded", "bg-red-500", "text-white", "p-1", "m-1")}>
                x
            </button>
        </div>
    );
}

const bindClasses = (...classNames: string[]) => {
    return classNames.join(" ");
}

export default DeletableTagView;