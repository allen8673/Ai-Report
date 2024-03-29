'use client'
import { concat, find, isEqual, map, some } from "lodash";
import { Button } from "primereact/button";
import { confirmDialog } from "primereact/confirmdialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { MenuItem } from "primereact/menuitem";
import { SelectItem } from "primereact/selectitem";
import { Splitter, SplitterPanel } from "primereact/splitter";
import { useEffect, useMemo, useState } from 'react'
import { v4 } from "uuid";

import { WorkflowEditorProps, WorkflowCreatorProps, WorkflowPreviewerProps, TemplateCreatorProps } from "./interface";

import { addFlow, deleteFlow, getAll, getFlow, updateFlow } from "@/api-helpers/flow-api";
import { getJobItemStatus, getJobslist } from "@/api-helpers/report-api";
import FlowEditor from "@/components/flow-editor";
import { flowInfoMap } from "@/components/flow-editor/configuration";
import { X_GAP, calculateDepth, expandRefWF, getNewIdTrans, hasDependencyCycle, ifFlowIsCompleted, resetDepth, resetPosition } from "@/components/flow-editor/lib";
import { FlowNameMapper } from "@/components/flow-editor/type";
import FlowList from "@/components/flow-list";
import Form from "@/components/form";
import { FormInstance } from "@/components/form/form";
import { useGraphRef } from "@/components/graph";
import Modal from "@/components/modal";
import ObjectDropdown from "@/components/object-dropdown";
import EmptyPane from "@/components/panes/empty";
import TitlePane from "@/components/panes/title";
import { IEditFlow, IFlow, IFlowBase, IFlowNode } from "@/interface/flow";
import { IJob } from "@/interface/job";
import { useLayoutContext } from "@/layout/standard-layout/context";
import { useWfLayoutContext } from "@/layout/workflow-layout/context";
import { useLongPolling } from "@/lib/utils";

function WorkFlowCreator({ openCreator, templateOpts, onCancel, onOk }: WorkflowCreatorProps) {

    const [form, setForm] = useState<FormInstance<IEditFlow>>();
    const [workflow, setWorkflow] = useState<IFlow>();

    const prepareNewWorkflow = async (paramObj: IEditFlow) => {
        const id = '';
        const template: (IFlow | undefined) =
            (!!paramObj.template ? await getFlow(paramObj.template) : undefined);

        if (!!template) {
            /**
             * if the user assigns a template,
             * then the graph directly uses it
             */
            const id_trans = getNewIdTrans(template.flows)
            let rootId = ''
            const flows: IFlowNode[] = template.flows.reduce<IFlowNode[]>((wf, tf) => {
                if (tf.type === 'Input') rootId = id_trans[tf.id]
                wf.push({
                    ...tf,
                    id: id_trans[tf.id],
                    forwards: map(tf.forwards, f => id_trans[f])
                })
                return wf;
            }, []);
            setWorkflow({ type: 'workflow', id, name: paramObj.name || '', flows, rootNdeId: [rootId], VERSION: 0 })

        } else {
            /**
             * if the user does not assign any template,
             * then the graph will append the Input and Output nodes as initialization
             */
            const rootId = `tmp_${v4()}`
            const doneId = `tmp_${v4()}`
            const flows: IFlowNode[] = [
                {
                    id: doneId,
                    type: 'Output',
                    name: flowInfoMap['Output'].nodeName,
                    position: { x: X_GAP * 3, y: 0 },
                    forwards: []
                },
                {
                    id: rootId,
                    type: 'Input',
                    name: flowInfoMap['Input'].nodeName,
                    position: { x: 0, y: 0 },
                    forwards: []
                },

            ]
            setWorkflow({ type: 'workflow', id, name: paramObj.name || '', flows, rootNdeId: [rootId], VERSION: 0 })
        }
    }

    useEffect(() => {
        if (!openCreator) {
            setWorkflow(undefined)
        }
    }, [openCreator])


    return (
        <>
            <Modal
                visible={openCreator && !workflow}
                title="Add New Workflow"
                okLabel="Add"
                onOk={() => {
                    form?.submit()
                        .then(({ name, template }) => {
                            prepareNewWorkflow({ name, template })
                        }).catch(() => {
                            // 
                        });
                }}
                onCancel={onCancel}>
                <Form
                    onLoad={(form: FormInstance<IEditFlow>) => {
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
            <WorkflowEditor workflow={workflow} onCancel={onCancel} onOk={onOk} />
        </>
    )

}

function WorkflowEditor({ workflow, workflows, onOk, onCancel, okLabel = 'save' }: WorkflowEditorProps) {
    const { graphRef } = useGraphRef<IFlowNode, any>();
    const flowNameMapper: FlowNameMapper = useMemo(() => {
        if (!workflows) return {};

        return workflows.reduce<FlowNameMapper>((pre, wf) => {
            if (wf.id !== workflow?.id) pre[wf.id] = wf.name
            return pre;
        }, {})

    }, [workflows])

    return (
        <Modal
            title={
                <h3 className="m-0">
                    {workflow?.name}
                    {!!workflow?.id && <i className="text-base ml-2 text-light-weak">({workflow?.id})</i>}
                </h3>
            }
            className='w-[90%] h-[90%] '
            footerClass="flex justify-end"
            showHeader={!!workflow?.name}
            visible={!!workflow}
            onOk={() => {
                if (!workflow) return
                const flows: IFlowNode[] = map(graphRef.current?.getNodes() || [], n => ({
                    ...n.data, position: n.position
                }));
                const result: IFlow = ({ ...workflow, type: 'workflow', flows });

                resetDepth(result.flows);
                const calculatedIds = calculateDepth(result.flows.filter(n => n.type === 'Input'), result.flows);
                resetDepth(result.flows, calculatedIds, 9999);
                onOk(result);
            }}
            okLabel={okLabel}
            onCancel={() => {
                onCancel()
            }}>
            <FlowEditor
                flows={workflow?.flows || []}
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
                inEdit
                delayRender={500}
                flowNameMapper={flowNameMapper}
            />
        </Modal>
    )
}

function WorkflowPreviewer({ onEdit, onRemove, onAddTemplate }: WorkflowPreviewerProps) {
    const { graphRef } = useGraphRef<IFlowNode, any>();
    const { runWorkflow, workflow, fetchingWorkflow } = useWfLayoutContext();

    const [jobs, setJobs] = useState<IJob[]>([]);
    const [job, setJob] = useState<IJob>();
    const { startLongPolling: statusLongPolling } = useLongPolling();
    const { startLongPolling: jobsLongPolling } = useLongPolling();

    const fetchJobs = async ({ workflow, jobId }: { workflow?: IFlow, jobId?: string }) => {
        if (!workflow) {
            setJobs([]);
            return false;
        }
        const joblists = await getJobslist(workflow.id);
        const _jobs = concat(joblists?.ongoing || [], joblists?.finish || []);
        setJobs(pre => isEqual(pre, _jobs) ? pre : _jobs);

        if (!!jobId) {
            const _job = find(_jobs, i => i.JOB_ID === jobId);
            const defVal = joblists?.ongoing?.[0] || joblists?.finish?.[0];
            setJob(_job || defVal)
        }

        return some(_jobs, j => j?.STATUS !== 'finish')
    }

    const checkJobStatus = async (_jobId: IJob) => {
        const jobStatus = await getJobItemStatus(_jobId.JOB_ID) || { ITEMS: [], STATUS: 'finish', REPORTDATA: '' };
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
        runWorkflow(workflow?.id, (jobId: string) => fetchJobs({ workflow: workflow, jobId }))
    }

    const reanderOption = (item?: IJob) => {
        if (!item) return <></>
        return (
            <div className="flex-h-center gap-2">
                <i className={`pi 
                               ${item.STATUS === 'finish' ? 'pi-check-circle text-success' : 'pi-spin pi-spinner'}
                               ${item.STATUS === 'warning' ? 'text-danger font-bold' : ''}
                               text-sm`} />
                {(!!item.JOBNAME ?
                    <b>{item.JOBNAME}</b> :
                    <i>{item.CREATE_TIME.replaceAll('-', '').replaceAll(':', '').replace(' ', '-').substring(0, 15)}</i>
                )}
                <span className="italic text-light-weak/[.8] text-sm">{`(${item.JOB_ID})`}</span>
            </div>
        );
    }

    useEffect(() => {
        fetchJobs({ workflow });
    }, [workflow]);

    useEffect(() => {
        jobsLongPolling(async () => {
            if (!jobs.length) return false
            return await fetchJobs({ workflow });
        })
    }, [jobs]);

    useEffect(() => {
        statusLongPolling(async () => {
            if (!job) return false;
            return await checkJobStatus(job)
        })
    }, [job]);

    return (
        <EmptyPane
            icon='pi-send'
            title='Select a workflow to show the graph'
            isEmpty={!workflow?.flows && !fetchingWorkflow}
        >
            <FlowEditor
                loading={fetchingWorkflow}
                flows={workflow?.flows || []}
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
                            <ObjectDropdown
                                id='jobids'
                                valueKey="JOB_ID"
                                reanderOption={reanderOption}
                                value={job}
                                options={jobs}
                                onChange={val => {
                                    setJob(val)
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
                                tooltip="Save as Template"
                                tooltipOptions={{ position: 'mouse' }}
                                icon='pi pi-tag'
                                onClick={() => {
                                    if (!workflow) return;
                                    onAddTemplate?.(workflow)
                                }}
                            />
                            <Button
                                className="py-0 px-[0px] h-[40px]"
                                severity='danger'
                                tooltip="Run Workflow"
                                tooltipOptions={{ position: 'mouse' }}
                                icon='pi pi-trash'
                                onClick={() => {
                                    if (!workflow) return;
                                    onRemove?.(workflow)
                                }}
                            />
                            <Button
                                className="h-[40px]"
                                label="Edit Workflow"
                                tooltipOptions={{ position: 'left' }}
                                icon='pi pi-pencil'
                                onClick={() => {
                                    if (!workflow) return;
                                    onEdit?.(workflow)
                                }}
                            />
                        </div >
                    </div>
                }
            />
        </EmptyPane>
    )
}

function TemplateCreator({ openCreator: openCreator, workflow, onCancel, onOk }: TemplateCreatorProps) {

    const { showMessage } = useLayoutContext();
    const [templateNodes, setTemplateNodes] = useState<IFlowNode[]>();
    const [form, setForm] = useState<FormInstance<IFlow>>();

    const createTemplateNodes = async (_workflow?: IFlow) => {
        const nodes = await expandRefWF({
            nodes: _workflow?.flows || [],
            workflowSource: async (ref_wf) => { return (await getFlow(ref_wf.workflowid)) }
        })
        // assign new ids to nodes
        const id_trans: Record<string, string> = getNewIdTrans(nodes)

        // calculate new position for all nodes
        const input_id = nodes.find(n => n.type === 'Input')?.id || '';
        resetPosition(nodes, [input_id])

        const _nodes = nodes.reduce<IFlowNode[]>((result, cur) => {
            result.push({
                ...cur,
                id: (id_trans[cur.id] || ''),
                forwards: (cur.forwards?.map(f => id_trans[f] || '').filter(i => !!i)) || [],
            })
            return result;
        }, []);

        return _nodes
    }

    const saveToNewTemplate = async (templateNodes: IFlowNode[], name: string) => {
        const template: IFlow = {
            type: 'template',
            id: '',
            rootNdeId: [],
            name,
            flows: templateNodes,
            VERSION: 0
        }
        const res = await addFlow(template);
        if (res.data.status === 'ok') {
            showMessage({
                type: 'success',
                message: res.data.message || 'Success',
            });
            setTemplateNodes(undefined)
        } else {
            showMessage({
                type: 'error',
                message: res.data.message || 'error',
            });
        }
    }

    useEffect(() => {
        if (!openCreator) {
            setTemplateNodes(undefined)
            return;
        }

        createTemplateNodes(workflow)
            .then(nodes => {
                setTemplateNodes(nodes)
            })
    }, [openCreator])

    return (
        <Modal
            title='Preview & Save as Template'
            className='w-[80%] h-[80%]'
            contentClassName="flex flex-col"
            visible={!!openCreator}
            onOk={async () => {
                const result = await form?.submit();
                if (!result) return;
                const template: IFlow = {
                    type: 'template',
                    id: '',
                    rootNdeId: [],
                    name: result.name || '',
                    flows: templateNodes || [],
                    VERSION: 0
                };
                await onOk(template);
            }}
            onCancel={onCancel}>
            <FlowEditor
                className="rounded-std bg-deep"
                flows={templateNodes || []}
                hideMiniMap
                delayRender={500}
            />
            <Form
                className="p-[20px]"
                onLoad={(form: FormInstance<IFlow>) => setForm(form)}
                onDestroyed={() => {
                    setForm(undefined)
                }}
                onSubmit={async ({ name }) => {
                    await saveToNewTemplate(templateNodes || [], name)
                }}
            >
                {
                    ({ Item }) => (
                        <>
                            <Item name={'name'} label="Template Name" rules={{ required: 'Please give a template name!' }}>
                                <InputText />
                            </Item>
                        </>
                    )
                }
            </Form>
        </Modal>
    )
}


export default function Page() {
    const { showMessage } = useLayoutContext();
    const { runWorkflow, workflow, fetchWorkflow } = useWfLayoutContext();

    const [workflows, setWorkflows] = useState<IFlowBase[]>([]);
    const [editWorkflow, setEditWorkflow] = useState<IFlow>();
    const [openWfCreator, setOpenWfCreator] = useState<boolean>();
    const [openTempCreator, setOpenTempCreator] = useState<boolean>();
    const [templateOpts, setTemplateOpts] = useState<SelectItem[]>([]);
    const [fetchingFlows, setFetchingFlows] = useState<boolean>();

    const renderMenus = (item: IFlowBase): MenuItem[] => [
        {
            label: 'Edit Workflow',
            icon: 'pi pi-pencil',
            className: 'bg-primary hover:bg-primary-600',
            command: async () => {
                const wf = await getFlow(item.id);
                setEditWorkflow(wf);
            }
        },
        {
            label: 'Delete Workflow',
            icon: 'pi pi-trash',
            className: 'bg-danger hover:bg-danger-600',
            command: () => {
                removeWorkflow(item)
            },
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
        try {
            setFetchingFlows(true)
            const { workflow, template } = await getAll() || {};
            setWorkflows(workflow || []);
            setTemplateOpts(template?.map(t => ({ label: t.name, value: t.id })) || [])
        } finally {
            setFetchingFlows(false)
        }
    }

    const removeWorkflow = async (wf: IFlowBase) => {
        confirmDialog({
            position: 'top',
            message: `Do you want to delete ${wf?.name || 'this workflow'}?`,
            header: `Delete Workflow`,
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger',
            accept: async () => {
                const rsp = await deleteFlow(wf?.id);
                if (rsp.data.status === 'failure' || rsp.data.status === 'NG') {
                    if (rsp.data.message) showMessage({
                        message: rsp.data.message,
                        type: 'error'
                    })
                    return;
                }
                if (workflow?.id === wf.id) {
                    fetchWorkflow(() => undefined)
                }
                await getAllData();
            },
        });
    }

    const saveToNewTemplate = async (result: IFlow) => {
        const res = (await addFlow(result)).data;
        if (res.status === 'ok') {
            showMessage({
                type: 'success',
                message: res.message || 'Success',
            });
            setOpenTempCreator(false);
        } else {
            showMessage({
                type: 'error',
                message: res.message || 'error',
            });
        }
    }

    const onAddTemplate = (wf: IFlow) => {
        if (!ifFlowIsCompleted(wf.flows)) {
            showMessage({
                message: 'Cannot be saved as a template since the workflow is not completed.',
                type: 'error'
            })
            return
        }
        if (hasDependencyCycle(wf.id, workflows || [])) {
            showMessage({
                message: 'Cannot be saved as a template since there are some dependency cycles.',
                type: 'error'
            })
            return
        }
        setOpenTempCreator(true)

    }

    useEffect(() => {
        getAllData();
    }, [])

    return (
        <div className="page-std">
            <TitlePane title='WorkFlow' />
            <Splitter className='shrink grow' style={{ height: '30px' }} layout='horizontal'>
                <SplitterPanel className="px-[7px] " size={80}>
                    <WorkflowPreviewer
                        onEdit={(wf) => { setEditWorkflow(wf) }}
                        onRemove={removeWorkflow}
                        onAddTemplate={onAddTemplate}
                    />
                </SplitterPanel>
                <SplitterPanel className="overflow-auto px-[7px]" size={20}>
                    <FlowList
                        loading={fetchingFlows}
                        defaultSelectedItem={workflow}
                        flows={workflows}
                        onAddWF={() => setOpenWfCreator(pre => !pre)}
                        onItemSelected={(item) => {
                            fetchWorkflow(async () => {
                                return await getFlow(item.id)
                            })
                        }}
                        renderMenus={renderMenus}
                    />
                </SplitterPanel>
            </Splitter>
            <WorkFlowCreator
                openCreator={openWfCreator}
                templateOpts={templateOpts}
                onCancel={() => {
                    confirmDialog({
                        position: 'top',
                        message: `Are you sure you want to cancel without saving? You will lose every modification.`,
                        header: `Cancel Add New Workflow`,
                        icon: 'pi pi-info-circle',
                        acceptClassName: 'p-button-danger',
                        accept: async () => {
                            setOpenWfCreator(false)
                        },
                    });
                }}
                onOk={async (result) => {
                    const res = (await addFlow(result)).data;
                    if (res.status === 'ok') {
                        showMessage({
                            type: 'success',
                            message: res.message || 'Success',
                        });
                        getAllData();
                        setOpenWfCreator(false);
                    } else {
                        showMessage({
                            type: 'error',
                            message: res.message || 'error',
                        });
                    }
                }}
            />
            <WorkflowEditor
                workflow={editWorkflow}
                workflows={workflows}
                onOk={async (result) => {
                    const res = (await updateFlow(result)).data;
                    if (res.status === 'ok') {
                        showMessage({
                            type: 'success',
                            message: res.message || 'Success',
                        });
                        if (result.id === workflow?.id) {
                            fetchWorkflow(async () => {
                                return await getFlow(result.id)
                            })
                        }
                        setEditWorkflow(undefined);
                    } else {
                        showMessage({
                            type: 'error',
                            message: res.message || 'error',
                        });
                    }
                }}
                onCancel={() => {
                    confirmDialog({
                        position: 'top',
                        message: `Are you sure you want to cancel without saving? You will lose every modification.`,
                        header: `Cancel Edit Workflow`,
                        icon: 'pi pi-info-circle',
                        acceptClassName: 'p-button-danger',
                        accept: async () => {
                            setEditWorkflow(undefined)
                        },
                    });
                }}
            />
            <TemplateCreator
                openCreator={openTempCreator}
                workflow={workflow}
                onCancel={() => setOpenTempCreator(false)}
                onOk={saveToNewTemplate}
            />
        </div >
    )
}
