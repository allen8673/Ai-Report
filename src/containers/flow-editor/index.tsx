'use client'
import { faMagicWandSparkles, faPlayCircle, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from 'primereact/button';
import { useState } from "react";
import { Connection } from "reactflow";
import { v4 } from "uuid";

import { mock_flows } from "../../mock-data/mock";

import { EDGE_DEF_SETTING, REPORT_ITEMS } from "./configuration";
import { GeneratorContext } from "./context";
import ReportItem from "./report-item";

import DndList from "@/components/dnd-list";
import FlowGraph from "@/components/flow-graph";
import { useGraphRef } from "@/components/graph/helper";
import { IFlow, IFlowBase } from "@/interface/workflow";

export default function FlowEditor() {

    const projectName = 'Demo Project';
    const [onDragItem, setOnDragItem] = useState<IFlowBase>();
    const { graphRef } = useGraphRef<IFlow, any>();
    const [selectedItem, setSelectedItem] = useState<string>()


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
                <FlowGraph
                    className="rounded-std bg-deep"
                    flows={mock_flows}
                    graphRef={graphRef}
                    onConnect={({ source, target }: Connection) => {
                        if (!source || !target) return;
                        const id = v4();
                        graphRef.current?.addEdge({ id, source, target, ...EDGE_DEF_SETTING })
                    }}
                    onMouseUp={(e, position) => {
                        if (!onDragItem || !position) return;
                        const id = v4();
                        graphRef.current?.addNode({ id, position, data: { ...onDragItem, position }, type: 'turbo' });
                        setOnDragItem(() => undefined);
                    }}

                />
            </div>
        </GeneratorContext.Provider>
    </div>
}