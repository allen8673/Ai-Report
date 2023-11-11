'use client'
import { faMagicWandSparkles, faPlayCircle, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import _ from "lodash";
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
import { FlowStatus, IFlow, IFlowBase } from "@/interface/workflow";

export default function FlowEditor() {

    const projectName = 'Demo Project';
    const [onDragItem, setOnDragItem] = useState<IFlowBase>();
    const { graphRef } = useGraphRef<IFlow, any>();
    const [selectedItem, setSelectedItem] = useState<string>()

    let timer: any;
    const mock_run = (forwards: string[]): void => {
        if (!!timer) clearTimeout(timer);
        let next: string[] = [];
        graphRef.current?.setNodes(pre => {
            if (_.includes(forwards, pre.id)) {
                next = _.uniq(next.concat(pre.data.forwards || []))
                return { ...pre, data: { ...pre.data, running: true } }
            }
            return pre
        });

        timer = setTimeout(async () => {
            graphRef.current?.setNodes(pre => {
                if (_.includes(forwards, pre.id)) {
                    let status: FlowStatus = 'success';
                    if (pre.id == 'f-2') status = 'failure';
                    else if (pre.id == 'f-5') status = 'warning';
                    return { ...pre, data: { ...pre.data, status: status, running: false } }
                }
                return pre
            });
            await new Promise(resolve => setTimeout(resolve, 500));
            if (!!next.length) mock_run(next);
        }, 3000);
    }

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
                            tooltipOptions={{ position: 'left' }}
                            onClick={(): void => {
                                // 
                            }}
                        />
                        <Button icon={<FontAwesomeIcon icon={faPlayCircle} />}
                            severity='success'
                            tooltip="Run Flow"
                            tooltipOptions={{ position: 'left' }}
                            onClick={async () => {
                                graphRef.current?.setNodes(pre => {
                                    return { ...pre, data: { ...pre.data, status: 'none', running: false } }
                                });
                                await new Promise(resolve => setTimeout(resolve, 500));
                                mock_run(['f-1'])
                            }}
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
                    hideMiniMap
                />
            </div>
        </GeneratorContext.Provider>
    </div>
}