import React from "react";

export interface TitlePaneProps {
    title: string;
    postContent?: React.ReactNode
}
export default function TitlePane({ title, postContent }: TitlePaneProps) {
    return <div className={`
            h-[60px] p-5 rounded-std m-1
            bg-deep-weak/[.4] border-light-weak/[.2] border-solid
            flex items-center justify-between`}>
        <h1 className="text-[32px]">{title}</h1>
        {!!postContent &&
            <div className="flex gap-std-sm">
                {postContent}
            </div>
        }
    </div>
}