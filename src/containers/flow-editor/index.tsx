'use client'
import { faCancel, faMagicWandSparkles, faPen, faPlayCircle, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import _ from "lodash";
import { Button } from 'primereact/button';
import { useState } from "react";
import { v4 } from "uuid";

import { REPORT_ITEMS } from "./configuration";
import { GeneratorContext } from "./context";
import ReportItem from "./report-item";

import DndList from "@/components/dnd-list";
import FlowGraph from "@/components/flow-graph";
import { useGraphRef } from "@/components/graph/helper";
import TitlePane from "@/components/title-pane";
import { FlowStatus, IFlow, IFlowBase, IWorkflow } from "@/interface/workflow";

export interface FlowEditorProps {
    workflow: IWorkflow;
    mode?: 'edit' | 'read';
    onSave?: (wf: IWorkflow) => void
}

export default function FlowEditor({ workflow, mode = 'read', onSave }: FlowEditorProps) {

    const [onDragItem, setOnDragItem] = useState<IFlowBase>();
    const { graphRef } = useGraphRef<IFlow, any>();
    const [selectedItem, setSelectedItem] = useState<string>();
    const [inEdit, setInEdit] = useState<boolean>(mode === 'edit')

    const mock_run = (forwards: string[]): void => {
        let next: string[] = [];
        graphRef.current?.setNodes(pre => {
            if (_.includes(forwards, pre.id)) {
                next = _.uniq(next.concat(pre.data.forwards || []))
                return { ...pre, data: { ...pre.data, running: true } }
            }
            return pre
        });

        _.debounce(async () => {
            graphRef.current?.setNodes(pre => {
                if (_.includes(forwards, pre.id)) {
                    let status: FlowStatus = 'success';
                    if (pre.id == 'f-2') status = 'failure';
                    else if (pre.id == 'f-5') status = 'warning';
                    return { ...pre, data: { ...pre.data, status: status, running: false } }
                }
                return pre
            });
            _.debounce(() => {
                if (!!next.length) mock_run(next);
            }, 500)()
        }, 3000)()
    }

    return <div className="flex h-full flex-row gap-std items-stretch">
        <GeneratorContext.Provider value={{ onDragItem }}>
            {!!inEdit && <div className="w-60 ">
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
            </div>}
            <div className="shrink grow flex flex-col gap-std">
                <TitlePane title={workflow.name} postContent={
                    <>
                        <Button icon={<FontAwesomeIcon icon={faMagicWandSparkles} />}
                            severity="secondary"
                            tooltip="Save as template"
                            tooltipOptions={{ position: 'bottom' }} />
                        {inEdit ?
                            <>
                                <Button icon={<FontAwesomeIcon icon={faCancel} />}
                                    severity='danger'
                                    tooltip="Cancel"
                                    tooltipOptions={{ position: 'bottom' }}
                                    onClick={async () => {
                                        graphRef.current?.resetAllElements();
                                        setInEdit(false)
                                    }}
                                />

                                <Button className="w-[100px]" icon={<FontAwesomeIcon className='mr-[7px]' icon={faSave} />}
                                    label="Save"
                                    tooltipOptions={{ position: 'bottom' }}
                                    onClick={async () => {
                                        const flows: IFlow[] = _.map(graphRef.current?.getNodes() || [], n => ({
                                            ...n.data, position: n.position
                                        }));
                                        onSave?.({ ...workflow, flows })
                                        setInEdit(false)
                                    }}
                                />
                            </> :
                            <>
                                <Button icon={<FontAwesomeIcon icon={faPlayCircle} />}
                                    severity='success'
                                    tooltip="Run Flow"
                                    tooltipOptions={{ position: 'bottom' }}
                                    onClick={async () => {
                                        graphRef.current?.setNodes(pre => {
                                            return { ...pre, data: { ...pre.data, status: 'none', running: false } }
                                        });
                                        await new Promise(resolve => setTimeout(resolve, 500));
                                        mock_run(['f-1'])
                                    }}
                                />
                                <Button className="w-[100px]" icon={<FontAwesomeIcon className='mr-[7px]' icon={faPen} />}
                                    label="Edit"
                                    tooltipOptions={{ position: 'left' }}
                                    onClick={(): void => {
                                        setInEdit(true);
                                    }}
                                />
                            </>}
                    </>}
                />
                <FlowGraph
                    className="rounded-std bg-deep"
                    flows={workflow.flows}
                    graphRef={graphRef}
                    onMouseUp={(e, position) => {
                        if (!onDragItem || !position) return;
                        const id = v4();
                        graphRef.current?.addNode({ id, position, data: { ...onDragItem, id, position, forwards: [] }, type: 'turbo' });
                        setOnDragItem(() => undefined);
                    }}
                    hideMiniMap
                    inEdit={inEdit}
                />
            </div>
        </GeneratorContext.Provider>
    </div>
}