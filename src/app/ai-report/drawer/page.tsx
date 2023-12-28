'use client'
import AiDrawer from "@/components/ai-draw";
import TitlePane from "@/components/panes/title";

export default function Page() {

    return <div className="page-std">
        <TitlePane title='Drawer' />
        <AiDrawer />
    </div>
}