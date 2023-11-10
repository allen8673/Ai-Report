'use client'
import _ from "lodash";
import { Button } from 'primereact/button';
import { useState } from "react";
import { Connection, Edge, Node } from 'reactflow'
import { v4 } from "uuid";

import { GeneratorContext } from "./context";
import TurboEdge, { TurboEdgeAsset } from "./graph-assets/turbo-edge";
import TurboNode from "./graph-assets/turbo-node";
import { initialEdges, initialNodes, reportItems } from "./mock";
import ReportItem from "./report-item";
import { IReportItem } from "./type";

import DndList from "@/components/dnd-list";
import Grapth from "@/components/graph";
import { useGraphRef } from "@/components/graph/helper";

import './graph-assets/turbo-style.css'
import './report-generator.css'

const EDGE_DEF_SETTING: Partial<Edge> = {
    type: 'turbo',
    animated: true,
    style: { strokeWidth: 3 }
}

export default function FlowGenerator() {

    const projectName = 'Demo Project';

    const [onDragItem, setOnDragItem] = useState<IReportItem>();
    const { graphRef } = useGraphRef<IReportItem, any>();
    const [selectedItem, setSelectedItem] = useState<string>()

    const nodes: Node<IReportItem>[] = _.map(initialNodes, n => ({ ...n, type: 'turbo' }));

    return <div className="flex h-full flex-row gap-std items-stretch">
        <GeneratorContext.Provider value={{ onDragItem }}>
            <div className="w-60 ">
                <DndList
                    className="rounded-std bg-std-deep"
                    items={reportItems}
                    disableChangeOrder
                    renderContent={(data) => <ReportItem
                        {...data}
                        onSelected={selectedItem === data.id}
                        onClick={(id) => { setSelectedItem(id) }}
                        onDelete={() => {
                            alert('on delete');
                        }} />}
                    onDragStart={(init, item): void => {
                        setOnDragItem(() => item)
                    }}

                />
            </div>
            <div className="shrink grow flex flex-col gap-std">
                <div className="rounded-std bg-std-deep std-title-pane">
                    {projectName}
                    <Button label="Submit" />
                </div>
                <Grapth
                    className="rounded-std bg-std-deep"
                    initialNodes={nodes}
                    initialEdges={initialEdges}
                    nodeTypes={{ turbo: TurboNode }}
                    edgeTypes={{ turbo: TurboEdge }}
                    graphRef={graphRef}
                    defaultEdgeOptions={EDGE_DEF_SETTING}
                    onConnect={({ source, target }: Connection) => {
                        if (!source || !target) return;
                        const id = v4();
                        graphRef.current?.addEdge({ id, source, target, ...EDGE_DEF_SETTING })
                    }}
                    onMouseUp={(e, position) => {
                        if (!onDragItem || !position) return;
                        const id = v4();
                        graphRef.current?.addNode({ id, position, data: onDragItem, type: 'turbo' });
                        setOnDragItem(() => undefined);
                    }}

                >
                    <TurboEdgeAsset />
                </Grapth>
            </div>
        </GeneratorContext.Provider>
    </div>
}