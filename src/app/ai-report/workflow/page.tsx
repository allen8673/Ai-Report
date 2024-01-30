'use client'
import RouterInfo from "@settings/router";
import { find } from "lodash";
import { useRouter } from "next/dist/client/components/navigation";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { MenuItem } from "primereact/menuitem";
import { SelectItem } from "primereact/selectitem";
import { Splitter, SplitterPanel } from "primereact/splitter";
import { useEffect, useState } from 'react'

import { getAll, getFlow } from "@/api-helpers/flow-api";
import { getJobItemStatus, getJobsOngoing } from "@/api-helpers/report-api";
import { coverToQueryString } from "@/api-helpers/url-helper";
import FlowEditor from "@/components/flow-editor";
import FlowList from "@/components/flow-list";
import Form from "@/components/form";
import { FormInstance } from "@/components/form/form";
import { useGraphRef } from "@/components/graph";
import Modal from "@/components/modal";
import EmptyPane from "@/components/panes/empty";
import TitlePane from "@/components/panes/title";
import { IFlowBase, IFlowNode } from "@/interface/flow";
import { IJob } from "@/interface/job";
import { useWfLayoutContext } from "@/layout/workflow-layout/context";
import { getFullUrl } from "@/lib/router";
import { useLongPolling } from "@/lib/utils";

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
    const { startLongPolling } = useLongPolling();

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

    const checkJobStatus = async (_jobId: string) => {
        const jobStatus = await getJobItemStatus(_jobId);
        graphRef.current?.setNodes(n => {
            const status = find(jobStatus, js => js.ITEM_ID === n.id)
            if (!!status) n.data.status = status.STATUS;
            return n
        })
    }

    useEffect(() => {
        startLongPolling(async () => {
            if (!jobId) return false;
            await checkJobStatus(jobId);
            return true
        })
    }, [jobId]);

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
                        <div className="flex-h-center w-full">
                            <div className="grow shrink flex-h-center gap-2 ">
                                <h3 className="text-light-weak ">Select on going Job ID:</h3>
                                <Dropdown
                                    value={jobId}
                                    options={jobs?.map(i => ({ label: i.JOB_ID, value: i.JOB_ID }))}
                                    onChange={e => setJobId(e.value)}
                                />
                            </div>
                            <div
                                className="flex gap-[7px]"
                                role='presentation'
                                onClick={(e) => e.stopPropagation()}>
                                <Button
                                    className="py-0 px-[0px] h-[40px]"
                                    severity='secondary'
                                    tooltip="Run Workflow"
                                    tooltipOptions={{ position: 'mouse' }}
                                    icon='pi pi-play'
                                    onClick={() => runWorkflow(cacheWorkflow.id)}
                                />
                                <Button
                                    className="py-0 px-[0px] h-[40px]"
                                    severity='info'
                                    tooltip="Reports"
                                    tooltipOptions={{ position: 'mouse' }}
                                    icon='pi pi-eye'
                                    onClick={() => viewReports(cacheWorkflow.id)}
                                />
                                <Button
                                    className="h-[40px]"
                                    label="Edit Workflow"
                                    tooltipOptions={{ position: 'left' }}
                                    icon='pi pi-pencil'
                                    onClick={() => {
                                        router.push(`${editorUrl}${coverToQueryString({ id: cacheWorkflow.id })}`);
                                    }}
                                />
                            </div >
                        </div>
                    }
                />
            </div> :
            <EmptyPane icon='pi-send' title='Select a workflow to show the graph' />
    )
}

export default function Page() {
    const router = useRouter();
    const { runWorkflow, viewReports, cacheWorkflow, setCacheWorkflow } = useWfLayoutContext();

    const [workflows, setWorkflows] = useState<IFlowBase[]>([]);
    const [addNewFlow, setAddNewFlow] = useState<boolean>();
    const [form, setForm] = useState<FormInstance<FormData>>();
    const [templateOpts, setTemplateOpts] = useState<SelectItem[]>([]);

    const renderMenus = (item: IFlowBase): MenuItem[] => [
        {
            label: 'Edit Workflow',
            icon: 'pi pi-pencil',
            className: 'bg-primary hover:bg-primary-600',
            command: () => {
                router.push(`${editorUrl}${coverToQueryString({ id: item.id })}`);
            }
        },
        {
            label: 'Reports',
            icon: 'pi pi-eye',
            className: 'bg-info hover:bg-info-deep',
            command: () => {
                viewReports(item.id)
            }
        },
        {
            label: 'Run Workflow',
            icon: 'pi pi-play',
            className: 'bg-secondary hover:bg-secondary-deep',
            command: () => {
                runWorkflow(item.id)
            },
        },
    ];

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
            <TitlePane title='WorkFlow' />
            <Splitter className='shrink grow' style={{ height: '30px' }} layout='horizontal'>
                <SplitterPanel className="px-[7px] " size={80}>
                    <WorkflowPreviewer />
                </SplitterPanel>
                <SplitterPanel className="overflow-auto px-[7px]" size={20}>
                    <FlowList
                        defaultSelectedItem={cacheWorkflow}
                        flows={workflows}
                        onAddWF={() => setAddNewFlow(pre => !pre)}
                        onItemSelected={async (item) => {
                            const flow = await getFlow(item.id)
                            setCacheWorkflow(flow);
                        }}
                        renderMenus={renderMenus}
                    />
                </SplitterPanel>
            </Splitter>
            <Modal
                visible={addNewFlow}
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
