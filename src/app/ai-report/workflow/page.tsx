'use client'
import { faAdd, faEye, faPaperPlane, faPen, faPlayCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RouterInfo from "@settings/router";
import { find } from "lodash";
import { useRouter } from "next/dist/client/components/navigation";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { SelectItem } from "primereact/selectitem";
import { Splitter, SplitterPanel } from "primereact/splitter";
import { useEffect, useState } from 'react'

import { getAll, getFlow } from "@/api-helpers/flow-api";
import { getJobItemStatus, getJobsOngoing } from "@/api-helpers/report-api";
import { coverToQueryString } from "@/api-helpers/url-helper";
import FlowEditor from "@/components/flow-editor";
import Form from "@/components/form";
import { FormInstance } from "@/components/form/form";
import { useGraphRef } from "@/components/graph";
import Modal from "@/components/modal";
import EmptyPane from "@/components/panes/empty";
import TitlePane from "@/components/panes/title";
import Table from "@/components/table";
import { Column } from "@/components/table/table";
import { IFlow, IFlowBase, IFlowNode } from "@/interface/flow";
import { IJob, IJobStatus } from "@/interface/job";
import { useWfLayoutContext } from "@/layout/workflow-layout/context";
import { getFullUrl } from "@/lib/router";

interface FormData {
    id?: string;
    name?: string;
    template?: string
}

function WorkflowPreviewer({ workflow }: { workflow?: IFlow }) {
    const { graphRef } = useGraphRef<IFlowNode, any>();
    const [jobs, setJobs] = useState<IJob[]>([]);
    const [jobId, setJobId] = useState<string>();
    const [executor, setExecutor] = useState<NodeJS.Timeout>()
    // const [jobStatus, setJobStatus] = useState<IJobStatus[]>();

    useEffect(() => {
        if (!workflow) {
            setJobs([]);
            return;
        }
        getJobsOngoing(workflow.id)
            .then(res => {
                setJobId(res?.[0]?.JOB_ID)
                setJobs(res || []);
            }).catch(() => {

            })
    }, [workflow]);


    const executeChechJobStatus = async (_jobId?: string) => {

        const checkJobStatus = async (_jobId: string) => {
            const jobStatus = await getJobItemStatus(_jobId);
            graphRef.current.setNodes(n => {
                const status = find(jobStatus, js => js.ITEM_ID === n.id)
                if (!!status) n.data.status = status.STATUS;
                return n
            })
        }

        if (!!executor) {
            clearInterval(executor)
        }
        if (!_jobId) return;
        await checkJobStatus(_jobId);
        const _executor = setInterval(async () => await checkJobStatus(_jobId), 5000);
        setExecutor(_executor)
    }

    useEffect(() => {
        executeChechJobStatus(jobId)
    }, [jobId])

    return (
        workflow?.flows ?
            <div className="w-full h-full relative">
                <FlowEditor
                    flows={workflow.flows}
                    graphRef={graphRef}
                    hideMiniMap
                    hideCtrls
                    fitView
                    fitViewOptions={{ duration: 1000 }}
                    onNodesChange={(changes) => {
                        if (changes.length > 1) {
                            graphRef.current.reactFlowInstance?.fitView({ duration: 500 })
                        }
                    }}
                />
                <div className="absolute top-[16px] left-[16px] flex-center gap-2 rounded-std bg-deep-weak/[.5] px-[12px]">
                    <h3 className="text-light-weak ">Select Job ID:</h3>
                    <Dropdown
                        value={jobId}
                        options={jobs?.map(i => ({ label: i.JOB_ID, value: i.JOB_ID }))}
                        onChange={e => setJobId(e.value)}
                    />
                </div>
            </div> :
            <EmptyPane icon={faPaperPlane} title='Select a workflow to show the graph' />
    )
}

export default function Page() {
    const router = useRouter();
    const editorUrl = getFullUrl(RouterInfo.WORKFLOW_EDITOR);
    const { runWorkflow, viewReports } = useWfLayoutContext()

    const [workflows, setWorkflows] = useState<IFlowBase[]>([]);
    const [addNewFlow, setAddNewFlow] = useState<boolean>();
    const [form, setForm] = useState<FormInstance<FormData>>();
    const [templateOpts, setTemplateOpts] = useState<SelectItem[]>([]);
    const [selection, setSelection] = useState<IFlow>();

    const getAllData = async () => {
        const { workflow, template } = await getAll() || {};
        setWorkflows(workflow || []);
        setTemplateOpts(template?.map(t => ({ label: t.name, value: t.id })) || [])
    }

    useEffect(() => {
        getAllData();
    }, [])

    const columns: Column<IFlowBase>[] = [
        { key: 'id', title: 'ID', style: { width: '25%' } },
        { key: 'name', title: 'Name' },
        {
            style: { width: 80, padding: 0 },
            format: (row) => {
                return <div
                    className="flex gap-[7px] px-[12px]"
                    role='presentation'
                    onClick={(e) => e.stopPropagation()}>
                    <Button
                        className="py-0 px-[0px] h-[40px]"
                        severity='secondary'
                        tooltip="Run Workflow"
                        tooltipOptions={{ position: 'mouse' }}
                        icon={
                            <FontAwesomeIcon icon={faPlayCircle} />
                        }
                        onClick={() => runWorkflow(row.id)}
                    />
                    <Button
                        className="py-0 px-[0px] h-[40px]"
                        severity='info'
                        tooltip="Reports"
                        tooltipOptions={{ position: 'mouse' }}
                        icon={
                            <FontAwesomeIcon icon={faEye} />
                        }
                        onClick={() => viewReports(row.id)}
                    />
                    <Button
                        className="gap-[7px] h-[40px]"
                        severity='success'
                        label="Edit Workflow"
                        tooltipOptions={{ position: 'left' }}
                        icon={
                            <FontAwesomeIcon icon={faPen} />
                        }
                        onClick={() => {
                            router.push(`${editorUrl}${coverToQueryString({ id: row.id })}`);
                        }}
                    />
                </div >
            }
        }
    ]

    return <div className="page-std">
        <TitlePane
            title='WorkFlow'
            postContent={
                <Button icon={<FontAwesomeIcon className='mr-[7px]' icon={faAdd} />}
                    severity="success"
                    label='Add New Workflow'
                    tooltipOptions={{ position: 'left' }}
                    onClick={() => {
                        setAddNewFlow(pre => !pre)
                    }}
                />
            }
        />
        <Splitter className='shrink grow' style={{ height: '300px' }} layout="vertical">
            <SplitterPanel className="px-[7px] " size={60}>
                <WorkflowPreviewer workflow={selection} />
            </SplitterPanel>
            <SplitterPanel className="overflow-auto px-[7px]" size={40}>
                <Table className='shrink grow' data={workflows} columns={columns}
                    paginator rows={10}
                    first={0}
                    totalRecords={5}
                    onSelectionChange={async e => {
                        const flow = await getFlow(e.value.id)
                        setSelection(flow);
                    }}
                    selection={selection}
                />
            </SplitterPanel>
        </Splitter>
        <Modal visible={addNewFlow}
            onOk={() => {
                form?.submit()
                    .then(({ name, template }) => {
                        const queries: { [key: string]: string | undefined } = { name, template }
                        router.push(`${editorUrl}${coverToQueryString(queries)}`);
                    }).catch(() => {
                        // 
                    });
            }}
            onCancel={() => {
                setAddNewFlow(false)
            }}>
            <Form
                onLoad={(form: FormInstance<FormData>) => {
                    setForm(form)
                }}
                onDestroyed={() => {
                    setForm(undefined)
                }}
            >
                {
                    ({ Item }) => (
                        <>
                            <Item name={'name'} label="Workflow Name" rules={{ required: 'Please give a name to workflow!', }}>
                                <InputText />
                            </Item>
                            <Item name={'template'} label="Template">
                                <Dropdown options={templateOpts} />
                            </Item>

                            {/* <List name='template' label="Template">{({ fields, append, remove, move }) => {
                                return <>
                                    <DndList
                                        items={fields}
                                        renderContent={(item, idx) => {
                                            return <div className="flex w-full mt-1">
                                                <Item className="grow" name={`template.${idx}.value`}>
                                                    <Dropdown options={templateOpts} />
                                                </Item>
                                                <Button
                                                    type='button'
                                                    severity='danger'
                                                    className="ml-1"
                                                    icon={<FontAwesomeIcon icon={faTrash} />}
                                                    onClick={(): void => {
                                                        remove(idx)
                                                    }}
                                                />
                                            </div>
                                        }}
                                        onDragEnd={({ source, destination }) => {
                                            if (destination?.index === undefined) return;
                                            move(source.index, destination.index)
                                        }}
                                    />
                                    <Button
                                        type='button'
                                        className="mt-2 w-full"
                                        icon={<FontAwesomeIcon icon={faAdd} />}
                                        onClick={(): void => {
                                            append({ value: '' })
                                        }}
                                    />
                                </>
                            }}
                            </List> */}
                        </>
                    )
                }
            </Form>
        </Modal>
    </div >
}
