'use client'
import RouterInfo from "@settings/router";
import { concat, find, isEqual, some } from "lodash";
import { useRouter } from "next/dist/client/components/navigation";
import { Button } from "primereact/button";
import { Dropdown, DropdownProps } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { MenuItem } from "primereact/menuitem";
import { SelectItem } from "primereact/selectitem";
import { Splitter, SplitterPanel } from "primereact/splitter";
import { useEffect, useState } from 'react'

import { getAll, getFlow } from "@/api-helpers/flow-api";
import { getJobItemStatus, getJobslist } from "@/api-helpers/report-api";
import { coverToQueryString } from "@/api-helpers/url-helper";
import FlowEditor from "@/components/flow-editor";
import FlowList from "@/components/flow-list";
import Form from "@/components/form";
import { FormInstance } from "@/components/form/form";
import { useGraphRef } from "@/components/graph";
import Modal from "@/components/modal";
import EmptyPane from "@/components/panes/empty";
import TitlePane from "@/components/panes/title";
import { IFlow, IFlowBase, IFlowNode } from "@/interface/flow";
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
    const [job, setJob] = useState<IJob>();
    const { startLongPolling: statusLongPolling } = useLongPolling();
    const { startLongPolling: jobsLongPolling } = useLongPolling();

    const fetchJobs = async (wf?: IFlow, jobId?: string, forceSelect?: boolean) => {
        if (!wf) {
            setJobs([]);
            return false;
        }
        const joblists = await getJobslist(wf.id);
        const _jobs = concat(joblists?.ongoing || [], joblists?.finish || []);
        setJobs(pre => isEqual(pre, _jobs) ? pre : _jobs);
        setJob(pre => {
            const defVal = pre || joblists?.ongoing?.[0] || joblists?.finish?.[0];
            const _job = find(_jobs, i => i.JOB_ID === jobId)
            if (forceSelect) {
                return _job || defVal
            }

            if (!!pre && pre.JOB_ID === _job?.JOB_ID) {
                return pre.STATUS === _job?.STATUS ? pre : _job
            }

            return defVal
        });
        return some(_jobs, j => j?.STATUS !== 'finish')
    }

    const checkJobStatus = async (_jobId: IJob) => {
        const jobStatus = await getJobItemStatus(_jobId.JOB_ID);
        if (!jobStatus) return false;
        graphRef.current?.setNodes(n => {
            const status = find(jobStatus?.ITEMS, js => js.ITEM_ID === n.id);

            if (jobStatus?.STATUS === 'finish') {
                n.data.status = undefined;
                n.data.reportData = n.data.type === "Output" ? jobStatus.REPORTDATA : status?.REPORTDATA;
                return n;
            } else {
                n.data.reportData = undefined
                n.data.status = status?.STATUS;
                return n;
            }
        })
        return jobStatus?.STATUS !== 'finish';
    }

    const onRunWorkflow = () => {
        runWorkflow(cacheWorkflow?.id, (jobId: string) => fetchJobs(cacheWorkflow, jobId, true))
    }

    const reanderOption = (item: IJob) => {
        return (
            <div className="flex-h-center gap-2">
                <i className={`pi ${item.STATUS === 'finish' ? 'pi-check-circle text-success' : 'pi-spin pi-spinner'}  text-sm`} />
                {(!!item.JOBNAME ?
                    <b>{item.JOBNAME}</b> :
                    <i>{item.CREATE_TIME.replaceAll('-', '').replaceAll(':', '').replace(' ', '-').substring(0, 15)}</i>
                )}
                <span className="italic text-light-weak/[.8] text-sm">{`(${item.JOB_ID})`}</span>
            </div>
        );
    }

    const valueTemplate = (opt: IJob | null, { value, placeholder }: DropdownProps) => {
        const selectedItem: IJob | undefined = opt || value;
        if (selectedItem) {
            return reanderOption(selectedItem)
        }

        return <i className="text-light-weak">{placeholder}</i>;
    }

    const itemTemplate = (opt: IJob) => {
        return reanderOption(opt)
    }

    useEffect(() => {
        fetchJobs(cacheWorkflow);
    }, [cacheWorkflow]);

    useEffect(() => {
        jobsLongPolling(async () => {
            if (!jobs.length) return false
            return await fetchJobs(cacheWorkflow, job?.JOB_ID);
        })
    }, [jobs]);

    useEffect(() => {
        statusLongPolling(async () => {
            if (!job) return false;
            return await checkJobStatus(job)
        })
    }, [job]);

    return (
        <EmptyPane icon='pi-send' title='Select a workflow to show the graph' isEmpty={!cacheWorkflow?.flows}>
            <FlowEditor
                flows={cacheWorkflow?.flows || []}
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
                actionBarContent={
                    <div className="flex-h-center w-full">
                        <div className="flex-h-center gap-2 grow shrink font-bold">
                            <label htmlFor='jobids' className="text-light-weak">Select Job ID:</label>
                            <Dropdown
                                id='jobids'
                                value={job}
                                valueTemplate={valueTemplate}
                                itemTemplate={itemTemplate}
                                options={jobs}
                                optionLabel="JOBNAME"
                                onChange={e => {
                                    setJob(e.value)
                                }}
                                placeholder="Select Job ID"
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
                                onClick={onRunWorkflow}
                            />
                            <Button
                                className="py-0 px-[0px] h-[40px]"
                                severity='info'
                                tooltip="Reports"
                                tooltipOptions={{ position: 'mouse' }}
                                icon='pi pi-eye'
                                onClick={() => viewReports(cacheWorkflow?.id || '')}
                            />
                            <Button
                                className="h-[40px]"
                                label="Edit Workflow"
                                tooltipOptions={{ position: 'left' }}
                                icon='pi pi-pencil'
                                onClick={() => {
                                    router.push(`${editorUrl}${coverToQueryString({ id: cacheWorkflow?.id || '' })}`);
                                }}
                            />
                        </div >
                    </div>
                }
            />
        </EmptyPane>
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
