'use client'
import { faCancel, faMagicWandSparkles, faPen, faPlayCircle, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import _ from "lodash";
import { Button } from 'primereact/button';
import { useState } from "react";

import FlowGraph from "@/components/flow-editor";
import { useGraphRef } from "@/components/graph/helper";
import TitlePane from "@/components/title-pane";
import { FlowStatus, IFlow, IWorkflow } from "@/interface/workflow";
import { useLayoutContext } from "@/layout/context";
import { mock_projects } from "@/mock-data/mock";

export default function Page() {

    const [workflow, setWorkflow] = useState<IWorkflow>(mock_projects[0]);
    const { graphRef } = useGraphRef<IFlow, any>();
    const [inEdit, setInEdit] = useState<boolean>()
    const { showMessage } = useLayoutContext();

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
                else {
                    showMessage('workflow is done')
                }
            }, 500)()
        }, 3000)()
    }

    return <div className="flex h-full flex-row gap-std items-stretch">
        <div className="shrink grow flex flex-col gap-std">
            <TitlePane title={workflow.name} postContent={
                <>
                    <Button icon={<FontAwesomeIcon icon={faMagicWandSparkles} />}
                        severity="secondary"
                        tooltip="Save as template"
                        tooltipOptions={{ position: 'bottom' }}
                        onClick={() => {
                        }}
                    />
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
                                    setWorkflow(pre => ({ ...pre, flows }))
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
                hideMiniMap
                inEdit={inEdit}
            />
        </div>
    </div>

}