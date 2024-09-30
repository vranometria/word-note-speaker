
// タグボタン
"use client";
import { useState } from "react";
import Tag from "@/app/types/tag";

interface TagViewProps {
    tag: Tag;
    isSelected: boolean;
    selected: (id:string) => void;
}

const TagView: React.FC<TagViewProps> = ({tag, isSelected=false, selected}) => {
    const [flg, setFlg] = useState(false);

    const selectClass = isSelected ? "bg-orange-400" : "bg-white";

    const onClick = () => {
        setFlg(!flg);
        selected(tag.id);
    };

    return (
        <div>
            <div>
                <button onClick={onClick} className={bindClasses(selectClass, "rounded", "w-auto", "text-black", "p-5", "m-1 whitespace-nowrap")} >
                    {tag.label}
                </button>
            </div>
        </div>
    );
}

const bindClasses = (...classNames: string[]) => {
    return classNames.join(" ");
}

export default TagView;