import React from "react";

export interface TitlePaneProps {
    title: string;
    postContent?: React.ReactNode
}
export default function TitlePane({ title, postContent }: TitlePaneProps) {
    return <div className="rounded-std h-[60px] py-[18px] flex items-center justify-between text-light text-[22px] ">
        {title}
        {!!postContent &&
            <div className="flex gap-std-sm">
                {postContent}
            </div>
        }
    </div>
}