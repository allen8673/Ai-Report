'use client'
import AiDraw from "@/components/ai-draw";
import TitlePane from "@/components/panes/title";

export default function Page() {

    return <div className="page-std">
        <TitlePane title='Draw' />
        <AiDraw />
    </div>
}