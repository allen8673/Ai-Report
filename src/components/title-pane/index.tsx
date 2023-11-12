import React from "react";

export interface TitlePaneProps {
    title: string;
    postContent?: React.ReactNode
}
export default function TitlePane({ title, postContent }: TitlePaneProps) {
    return <div className="rounded-std std-title-pane">
        {title}
        {!!postContent &&
            <div className="flex gap-std-sm">
                {postContent}
            </div>
        }
    </div>
}