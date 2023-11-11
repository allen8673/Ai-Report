'use client'
import { faMagicWandSparkles, faPlayCircle, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import _ from "lodash";
import { Button } from 'primereact/button';
import { useState } from "react";
import { Connection, Node } from 'reactflow'
import { v4 } from "uuid";

import { initialEdges, initialNodes } from "../../app/mock";

import { EDGE_DEF_SETTING, REPORT_ITEMS } from "./configuration";
import { GeneratorContext } from "./context";
import TurboEdge, { TurboEdgeAsset } from "./graph-assets/turbo-edge";
import TurboNode from "./graph-assets/turbo-node";
import ReportItem from "./report-item";

import DndList from "@/components/dnd-list";
import Grapth from "@/components/graph";
import { useGraphRef } from "@/components/graph/helper";
import { IFlow } from "@/interface/project";
import './graph-assets/turbo-style.css'



export default function FlowGenerator() {

    const projectName = 'Demo Project';
    const [onDragItem, setOnDragItem] = useState<IFlow>();
    const { graphRef } = useGraphRef<IFlow, any>();
    const [selectedItem, setSelectedItem] = useState<string>()

    const nodes: Node<IFlow>[] = _.map(initialNodes, n => ({ ...n, type: 'turbo' }));

    return <div className="flex h-full flex-row gap-std items-stretch">
        <GeneratorContext.Provider value={{ onDragItem }}>
            <div className="w-60 ">
                <DndList
                    className="rounded-std bg-deep"
                    items={REPORT_ITEMS}
                    disableChangeOrder
                    renderContent={(data) => <ReportItem
                        {...data}
                        onSelected={selectedItem === data.id}
                        onClick={(id) => { setSelectedItem(id) }}
                    />}
                    onDragStart={(init, item): void => {
                        setOnDragItem(() => item)
                    }}

                />
            </div>
            <div className="shrink grow flex flex-col gap-std">
                <div className="rounded-std  std-title-pane">
                    {projectName}
                    <div className="act-pane">
                        <Button icon={<FontAwesomeIcon icon={faMagicWandSparkles} />}
                            severity="secondary"
                            tooltip="Save as template"
                            tooltipOptions={{ position: 'left' }} />
                        <Button icon={<FontAwesomeIcon icon={faSave} />}
                            tooltip="Save"
                            tooltipOptions={{ position: 'left' }} />
                        <Button icon={<FontAwesomeIcon icon={faPlayCircle} />}
                            severity='success'
                            tooltip="Run Flow"
                            tooltipOptions={{ position: 'left' }}
                        />
                    </div>
                </div>
                <Grapth
                    className="rounded-std bg-deep"
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