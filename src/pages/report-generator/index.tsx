'use client'
import _ from "lodash";
import { useState } from "react";
import { Connection, ConnectionLineType, Edge, MarkerType, Node } from 'reactflow'
import { v4 } from "uuid";

import { GeneratorContext } from "./context";
import { initialEdges, initialNodes, reportItems } from "./mock";
import ReportItem from "./report-item";
import MiddleNode from "./report-nodes/middle";
import { IReportItem } from "./type";

import DndList from "@/components/dnd-list";
import Grapth from "@/components/graph";
import { useGraphRef } from "@/components/graph/helper";

const EDGE_DEF_SETTING: Partial<Edge> = {
    type: 'smoothstep',
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20 },
    style: { strokeWidth: 3 }
}

export default function ReportGenerator() {


    const [onDragItem, setOnDragItem] = useState<IReportItem>();
    const { graphRef } = useGraphRef<IReportItem, any>();

    const nodes: Node<IReportItem>[] = _.map(initialNodes, n => ({ ...n, type: 'middle' }));
    const edges: Edge[] = _.map(initialEdges, e => ({
        ...e, ...EDGE_DEF_SETTING
    }))

    return <div className="flex h-full flex-row gap-4 items-stretch">
        <GeneratorContext.Provider value={{ onDragItem }}>
            <div className="w-60 ">
                <DndList
                    items={reportItems}
                    disableChangeOrder
                    renderContent={(data) => <ReportItem
                        {...data}
                        onDelete={() => {
                            alert('on delete');
                        }} />}
                    onDragStart={(init, item): void => {
                        setOnDragItem(() => item)
                    }}

                />
            </div>
            <div className="shrink grow">
                <Grapth
                    className=""
                    initialNodes={nodes}
                    initialEdges={edges}
                    nodeTypes={{ middle: MiddleNode }}
                    graphRef={graphRef}
                    connectionLineType={ConnectionLineType.SmoothStep}
                    onConnect={({ source, target }: Connection) => {
                        if (!source || !target) return;
                        const id = v4();
                        graphRef.current?.addEdge({ id, source, target, ...EDGE_DEF_SETTING })
                    }}
                    onMouseUp={(e, position) => {
                        if (!onDragItem || !position) return;
                        const id = v4();
                        graphRef.current?.addNode({ id, position, data: onDragItem, type: 'middle' });
                        setOnDragItem(() => undefined);
                    }}

                />
            </div>
        </GeneratorContext.Provider>
    </div>
}