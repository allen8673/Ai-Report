'use client'
import { initialEdges, initialNodes } from "./mock";

import DndList from "@/components/dnd-list";
import Grapth from "@/components/graph";

export default function ReportGenerator() {
    return <div className="flex h-full flex-row p-12 gap-4 items-stretch">
        <div className="w-60 ">
            <DndList items={[{ name: '1' }, { name: '2' }]} renderContent={(prop) => <div className=" bg-stone-400">{prop.name}</div>} />
        </div>
        <div className="shrink grow">
            <Grapth className="" initialNodes={initialNodes} initialEdges={initialEdges} />
        </div>
    </div>
}