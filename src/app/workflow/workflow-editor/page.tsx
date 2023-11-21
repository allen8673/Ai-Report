'use client'
import { faCancel, faMagicWandSparkles, faPen, faPlayCircle, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import _ from "lodash";
import { useSearchParams } from "next/navigation";
import { Button } from 'primereact/button';
import { useEffect, useState } from "react";
import { v4 } from "uuid";

import FlowGraph from "@/components/flow-editor";
import { useGraphRef } from "@/components/graph/helper";
import TitlePane from "@/components/title-pane";
import { FlowStatus, IEditWorkflow, IFlow, IWorkflow } from "@/interface/workflow";
import { useLayoutContext } from "@/layout/context";
import { mock_templates, mock_workflows } from "@/mock-data/mock";
import { coverSearchParamsToObj } from "@/untils/urlHelper";

type EditMode = 'add' | 'normal'

export default function Page() {
    const searchParams = useSearchParams()
    const [workflow, setWorkflow] = useState<IWorkflow>();
    const { graphRef } = useGraphRef<IFlow, any>();
    const [inEdit, setInEdit] = useState<boolean>()
    const { showMessage } = useLayoutContext();

    useEffect(() => {
        const obj = coverSearchParamsToObj<IEditWorkflow>(searchParams);
        const mode: EditMode = !!obj.id ? 'normal' : 'add';
        setInEdit(mode === 'add');
        if (mode === 'normal') {
            setWorkflow(_.find(mock_workflows, ['id', obj.id]))
        } else {
            const id = v4();
            const temps = obj.template?.split(',') || [];
            const flows: IFlow[] = temps.length > 0 ? _.find(mock_templates, ['id', temps[0]])?.flows || [] : [];
            setWorkflow({ id, name: obj.name || '', flows, rootNdeId: '' })
        }
    }, [])

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
                    let report: any = undefined;
                    if (pre.id == 'f-2') status = 'failure';
                    else if (pre.id == 'f-5') status = 'warning';

                    if (pre.data.type === 'file-download') {
                        report = <>{_.map(_.range(0, 30), () => (<p>
                            <p className="m-0">
                                Next.js is a React framework for building full-stack web applications. You use React Components to build user interfaces, and Next.js for additional features and optimizations.
                            </p>
                            <p className="m-0">
                                Under the hood, Next.js also abstracts and automatically configures tooling needed for React, like bundling, compiling, and more. This allows you to focus on building your application instead of spending time with configuration.
                            </p>
                            <p className="m-0">
                                Whether you re an individual developer or part of a larger team, Next.js can help you build interactive, dynamic, and fast React applications.
                            </p>
                        </p>))}</>
                    }

                    return { ...pre, data: { ...pre.data, status: status, running: false, report } }
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
            <TitlePane title={workflow?.name || 'New Workfow'} postContent={
                <>
                    <Button icon={<FontAwesomeIcon icon={faMagicWandSparkles} />}
                        severity='info'
                        tooltip="Save as template"
                        tooltipOptions={{ position: 'bottom' }}
                        onClick={() => {
                        }}
                    />
                    {inEdit ?
                        <>
                            <Button icon={<FontAwesomeIcon icon={faCancel} />}
                                severity='secondary'
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
                                    setWorkflow(pre => !!pre ? ({ ...pre, flows }) : pre)
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
                                    if (!!workflow?.rootNdeId) mock_run([workflow?.rootNdeId])
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
                flows={workflow?.flows || []}
                graphRef={graphRef}
                hideMiniMap
                inEdit={inEdit}
            />
        </div>
    </div>

}