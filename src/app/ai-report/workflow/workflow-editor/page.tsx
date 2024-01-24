'use client'
import { faCancel, faEye, faMagicWandSparkles, faPen, faPlayCircle, faSave, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RouterInfo from "@settings/router";
import { map, size } from "lodash";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from 'primereact/button';
import { confirmDialog } from "primereact/confirmdialog";
import { InputText } from "primereact/inputtext";
import { useEffect, useMemo, useState } from "react";
import { v4 } from "uuid";

import { addFlow, deleteFlow, getFlow, getFlows, updateFlow } from "@/api-helpers/flow-api";
import { coverSearchParamsToObj } from "@/api-helpers/url-helper";
import FlowEditor from "@/components/flow-editor";
import { flowInfoMap } from "@/components/flow-editor/configuration";
import { X_GAP, calculateDepth, expandRefWF, getNewIdTrans, hasDependencyCycle, ifFlowIsCompleted, resetPosition } from "@/components/flow-editor/lib";
import { FlowNameMapper } from "@/components/flow-editor/type";
import Form from "@/components/form";
import { FormInstance } from "@/components/form/form";
import { useGraphRef } from "@/components/graph";
import Modal from "@/components/modal";
import TitlePane from "@/components/panes/title";
import { IEditFlow, IFlowNode, IFlow, IFlowBase } from "@/interface/flow";
import { useLayoutContext } from "@/layout/standard-layout/context";
import { useWfLayoutContext } from "@/layout/workflow-layout/context";
import { getFullUrl } from "@/lib/router";

type EditMode = 'add' | 'normal'



export default function Page() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const wfUrl = getFullUrl(RouterInfo.WORKFLOW);
    const paramObj = coverSearchParamsToObj<IEditFlow>(searchParams);
    const [mode, setMode] = useState<EditMode>(!!paramObj.id ? 'normal' : 'add')
    const { graphRef } = useGraphRef<IFlowNode, any>();
    const { showMessage } = useLayoutContext();
    const { runWorkflow, viewReports } = useWfLayoutContext()

    const [workflow, setWorkflow] = useState<IFlow>();
    const [workflows, setWorkflows] = useState<IFlowBase[]>();
    const [inEdit, setInEdit] = useState<boolean>();
    const [templateNodes, setTemplateNodes] = useState<IFlowNode[]>();

    const flowNameMapper: FlowNameMapper = useMemo(() => {
        if (!workflows) return {};

        return workflows.reduce<FlowNameMapper>((pre, wf) => {
            if (wf.id !== paramObj?.id) pre[wf.id] = wf.name
            return pre;
        }, {})

    }, [workflows])
    const [form, setForm] = useState<FormInstance<IFlow>>();

    useEffect(() => {
        initial()
    }, []);

    const initial = async () => {
        setInEdit(mode === 'add');
        await fetchAllWorflowData();
        if (mode === 'add') {
            prepareNewWorkflow(paramObj)
        } else {
            fetchWorkflow(paramObj.id || '')
        }
    }

    const fetchAllWorflowData = async () => {
        const wfs = await getFlows('WORKFLOW')
        if (!wfs) return;
        setWorkflows(wfs);
    }

    const fetchWorkflow = async (id: string) => {
        const wf = await getFlow(id)
        setWorkflow(wf);
    }

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
            id: '', //v4(),
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

    const wfActionBtns = inEdit ?
        <>
            <Button icon={<FontAwesomeIcon icon={faTrash} />}
                severity='danger'
                tooltip="Remove the workflow"
                tooltipOptions={{ position: 'bottom' }}
                onClick={async () => {
                    confirmDialog({
                        position: 'top',
                        message: `Do you want to delete ${workflow?.name || 'this workflow'}?`,
                        header: `Delete Workflow`,
                        icon: 'pi pi-info-circle',
                        acceptClassName: 'p-button-danger',
                        accept: async () => {
                            const rsp = await deleteFlow(workflow?.id);
                            if (rsp.data.status === 'failure' || rsp.data.status === 'NG') {
                                if (rsp.data.message) showMessage({
                                    message: rsp.data.message,
                                    type: 'error'
                                })
                                return;
                            }
                            router.push(wfUrl)
                        },
                    });
                }}
            />
            <Button icon={<FontAwesomeIcon icon={faCancel} />}
                severity='secondary'
                tooltip="Cancel"
                tooltipOptions={{ position: 'bottom' }}
                onClick={async () => {
                    confirmDialog({
                        position: 'top',
                        message: `Are you sure you want to cancel without saving? You will lose every modification.`,
                        header: `Cancel modify`,
                        icon: 'pi pi-info-circle',
                        acceptClassName: 'p-button-danger',
                        accept: async () => {
                            graphRef.current?.resetAllElements();
                            setInEdit(false)
                        },
                    });
                }}
            />
            <Button className="w-[100px]" icon={<FontAwesomeIcon className='mr-[7px]' icon={faSave} />}
                label="Save"
                tooltipOptions={{ position: 'bottom' }}
                onClick={async () => {
                    if (!workflow) return;
                    const flows: IFlowNode[] = map(graphRef.current?.getNodes() || [], n => ({
                        ...n.data, position: n.position
                    }));

                    const result: IFlow = ({ ...workflow, type: 'workflow', flows });
                    calculateDepth(result.flows.filter(n => n.type === 'Input'), result.flows);

                    const res = await (await (mode === 'add' ? addFlow : updateFlow)(result)).data

                    if (res.status !== 'ok' && res.status !== 'success') {
                        showMessage({
                            message: res.message || 'Add failure',
                            type: 'error'
                        })
                        return;
                    }
                    setWorkflow({ ...result, id: res.data?.workflowid || workflow.id });
                    setInEdit(false);
                    setMode('normal')
                }}
            />
        </> :
        <>
            <Button icon={<FontAwesomeIcon icon={faMagicWandSparkles} />}
                disabled={!size(workflow?.flows)}
                severity='secondary'
                tooltip="Save as template"
                tooltipOptions={{ position: 'bottom' }}
                onClick={async () => {
                    if (!workflow) return;
                    if (!ifFlowIsCompleted(workflow.flows)) {
                        showMessage({
                            message: 'Cannot be saved as a template since the workflow is not completed.',
                            type: 'error'
                        })
                        return
                    }
                    if (hasDependencyCycle(workflow.id, workflows || [])) {
                        showMessage({
                            message: 'Cannot be saved as a template since there are some dependency cycles.',
                            type: 'error'
                        })
                        return
                    }
                    createTemplateNodes(workflow)
                        .then(tempNodes => {
                            setTemplateNodes(tempNodes)
                        })
                }}
            />
            <Button icon={<FontAwesomeIcon icon={faPlayCircle} />}
                severity='success'
                tooltip="Run Workflow"
                tooltipOptions={{ position: 'bottom' }}
                onClick={async () => {
                    runWorkflow(workflow)
                }}
            />
            <Button icon={<FontAwesomeIcon icon={faEye} />}
                severity='info'
                tooltip="View Reports"
                tooltipOptions={{ position: 'bottom' }}
                disabled={!workflow?.id}
                onClick={() => {
                    if (!workflow?.id) return;
                    viewReports(workflow?.id)
                }}
            />
            <Button icon={<FontAwesomeIcon className='mr-[7px]' icon={faPen} />}
                className="w-[100px]"
                label="Edit"
                tooltipOptions={{ position: 'left' }}
                onClick={(): void => {
                    setInEdit(true);
                }}
            />
        </>

    return (
        <div className="page-std">
            <div className="shrink grow flex flex-col gap-std">
                <TitlePane title={workflow?.name || 'New Workfow'} />
                <FlowEditor
                    className="rounded-std bg-deep"
                    flows={workflow?.flows || []}
                    graphRef={graphRef}
                    hideMiniMap
                    inEdit={inEdit}
                    actionBarContent={(graphProps, actionBtns) => {
                        return <><div>{inEdit && actionBtns}</div> <div className="flex gap-2 px-[18px]">{wfActionBtns}</div></>
                    }}
                    actionBarClass='justify-between'
                    showActionBar
                    flowNameMapper={flowNameMapper}
                />
                <Modal
                    title='Preview & Save as Template'
                    className='w-[80%] h-[80%]'
                    contentClassName="flex flex-col"
                    visible={!!templateNodes}
                    onOk={() => {
                        form?.submit()
                            .then(async ({ name }) => {
                                await saveToNewTemplate(templateNodes || [], name)
                            })
                            .catch(() => {
                                // 
                            });
                    }}
                    onCancel={() => {
                        setTemplateNodes(undefined)
                    }}>
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
            </div>
        </div>
    )
}