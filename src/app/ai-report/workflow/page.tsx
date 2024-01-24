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
import List from "@/components/list";
import Modal from "@/components/modal";
import EmptyPane from "@/components/panes/empty";
import TitlePane from "@/components/panes/title";
import { IFlowBase, IFlowNode } from "@/interface/flow";
import { IJob } from "@/interface/job";
import { useWfLayoutContext } from "@/layout/workflow-layout/context";
import { getFullUrl } from "@/lib/router";

const editorUrl = getFullUrl(RouterInfo.WORKFLOW_EDITOR);
interface FormData {
    id?: string;
    name?: string;
    template?: string
}

function WorkflowPreviewer() {
    const { graphRef } = useGraphRef<IFlowNode, any>();
    const { runWorkflow, viewReports, cacheWorkflow } = useWfLayoutContext()
    const router = useRouter();
    const [jobs, setJobs] = useState<IJob[]>([]);
    const [jobId, setJobId] = useState<string>();
    const [executor, setExecutor] = useState<NodeJS.Timeout>()

    useEffect(() => {
        if (!cacheWorkflow) {
            setJobs([]);
            return;
        }
        getJobsOngoing(cacheWorkflow.id)
            .then(res => {
                setJobId(res?.[0]?.JOB_ID)
                setJobs(res || []);
            }).catch(() => {

            })
    }, [cacheWorkflow]);

    const stopChechJobStatus = () => {
        if (executor != undefined) {
            clearInterval(executor)
        }
    }

    const executeChechJobStatus = async (_jobId?: string) => {
        const checkJobStatus = async (_jobId: string) => {
            const jobStatus = await getJobItemStatus(_jobId);
            graphRef.current?.setNodes(n => {
                const status = find(jobStatus, js => js.ITEM_ID === n.id)
                if (!!status) n.data.status = status.STATUS;
                return n
            })
        }
        stopChechJobStatus();
        if (!_jobId) return;
        await checkJobStatus(_jobId);
        const _executor = setInterval(async () => await checkJobStatus(_jobId), 5000);
        setExecutor(_executor)
    }

    useEffect(() => {
        executeChechJobStatus(jobId);
    }, [jobId]);

    useEffect(() => {
        return stopChechJobStatus;
    }, [executor]);

    return (
        cacheWorkflow?.flows ?
            <div className="w-full h-full relative">
                <FlowEditor
                    flows={cacheWorkflow.flows}
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
                    showActionBar
                    actionBarContent={
                        <div className="flex-h-center w-full px-[18px]">
                            <div className="grow shrink flex-h-center gap-2 ">
                                <h3 className="text-light-weak ">Select on going Job ID:</h3>
                                <Dropdown
                                    value={jobId}
                                    options={jobs?.map(i => ({ label: i.JOB_ID, value: i.JOB_ID }))}
                                    onChange={e => setJobId(e.value)}
                                />
                            </div>
                            <div
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
                                    onClick={() => runWorkflow(cacheWorkflow.id)}
                                />
                                <Button
                                    className="py-0 px-[0px] h-[40px]"
                                    severity='info'
                                    tooltip="Reports"
                                    tooltipOptions={{ position: 'mouse' }}
                                    icon={
                                        <FontAwesomeIcon icon={faEye} />
                                    }
                                    onClick={() => viewReports(cacheWorkflow.id)}
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
                                        router.push(`${editorUrl}${coverToQueryString({ id: cacheWorkflow.id })}`);
                                    }}
                                />
                            </div >
                        </div>
                    }
                />
            </div> :
            <EmptyPane icon={faPaperPlane} title='Select a workflow to show the graph' />
    )
}

function ListItem({ key, item, }: { key: string; item: IFlowBase; }) {
    const { cacheWorkflow } = useWfLayoutContext()

    return (
        <div key={key} className={`h-[88px] px-3 py-2 text-light m-1.5
                         border-light border-solid rounded-std 
                         flex items-center
                         ${cacheWorkflow?.id === item.id ? 'bg-turbo-deep-weak/[.6]' : ''}
                         hover:bg-deep-weak `}>
            <div className="grow shrink flex flex-col">
                <div className="text-xl ellipsis overflow-hidden ">{item.name}</div>
                <i className="ellipsis overflow-hidden text-light-weak">{item.id}</i>
            </div>
            <Button className={`border-4 min-w-9 min-h-9`} icon='pi pi-ellipsis-h' outlined rounded severity='secondary' />
        </div>
    )
}

function WorkflowList({ workflows }: { workflows: IFlowBase[] }) {
    const { setCacheWorkflow: setSelection } = useWfLayoutContext()


    return <List
        className="overflow-hidden"
        data={workflows}
        renderItem={(item, idx) => <ListItem key={`wf-${idx}`} item={item} />}
        onItemClick={async (item) => {
            const flow = await getFlow(item.id)
            setSelection(flow);
        }} />
}

export default function Page() {
    const router = useRouter();
    const [workflows, setWorkflows] = useState<IFlowBase[]>([]);
    const [addNewFlow, setAddNewFlow] = useState<boolean>();
    const [form, setForm] = useState<FormInstance<FormData>>();
    const [templateOpts, setTemplateOpts] = useState<SelectItem[]>([]);

    const getAllData = async () => {
        const { workflow, template } = await getAll() || {};
        setWorkflows(workflow || []);
        setTemplateOpts(template?.map(t => ({ label: t.name, value: t.id })) || [])
    }

    useEffect(() => {
        getAllData();
    }, [])

    return (
        <div className="page-std">
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
            <Splitter className='shrink grow' style={{ height: '30px' }} layout='horizontal'>
                <SplitterPanel className="px-[7px] " size={80}>
                    <WorkflowPreviewer />
                </SplitterPanel>
                <SplitterPanel className="overflow-auto px-[7px]" size={20}>
                    <WorkflowList workflows={workflows} />
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
                            </>
                        )
                    }
                </Form>
            </Modal>
        </div >
    )
}
