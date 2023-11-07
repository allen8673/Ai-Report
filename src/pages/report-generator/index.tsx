'use client'
import _ from "lodash";

import { initialEdges, initialNodes, reportItems } from "./mock";
import ReportItem from "./report-item";
import MiddleNode from "./report-nodes/middle";

import DndList from "@/components/dnd-list";
import Grapth from "@/components/graph";

export default function ReportGenerator() {

    const nodes = _.map(initialNodes, n => ({ ...n, type: 'middle' }))

    return <div className="flex h-full flex-row p-12 gap-4 items-stretch">
        <div className="w-60 ">
            <DndList
                items={reportItems}
                renderContent={(data) => <ReportItem
                    {...data}
                    onDelete={() => {
                        alert('on delete');
                    }} />}
            />
        </div>
        <div className="shrink grow">
            <Grapth className="" initialNodes={nodes} initialEdges={initialEdges} nodeTypes={{ middle: MiddleNode }} />
        </div>
    </div>
}