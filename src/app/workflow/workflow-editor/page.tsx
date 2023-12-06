'use client'
import { faCancel, faMagicWandSparkles, faPen, faPlayCircle, faSave, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cloneDeep, debounce, filter, find, includes, map, range, remove, some, uniq } from "lodash";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from 'primereact/button';
import { confirmDialog } from "primereact/confirmdialog";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import { v4 } from "uuid";

import apiCaller from "@/api-helpers/api-caller";
import { coverSearchParamsToObj } from "@/api-helpers/url-helper";
import FlowGraph from "@/components/flow-editor";
import { flowInfoMap } from "@/components/flow-editor/configuration";
import { IWorkflowMap } from "@/components/flow-editor/context";
import { X_GAP, calculateDepth, getNewIdTrans, getNewPosition } from "@/components/flow-editor/helper";
import Form from "@/components/form";
import { FormInstance } from "@/components/form/form";
import { useGraphRef } from "@/components/graph/helper";
import Modal from "@/components/modal";
import TitlePane from "@/components/title-pane";
import { ApiResult } from "@/interface/api";
import { FlowStatus, IEditWorkflow, IFlow, ITemplate, IWorkflow } from "@/interface/workflow";
import { useLayoutContext } from "@/layout/context";
import RouterInfo, { getFullUrl } from "@/settings/router-setting";

type EditMode = 'add' | 'normal'

export default function Page() {
    const searchParams = useSearchParams();
    const paramObj = coverSearchParamsToObj<IEditWorkflow>(searchParams);
    const mode: EditMode = !!paramObj.id ? 'normal' : 'add';
    const [workflow, setWorkflow] = useState<IWorkflow>();
    const { graphRef } = useGraphRef<IFlow, any>();
    const [inEdit, setInEdit] = useState<boolean>();
    const [openTemplateModal, setOpenTemplateModal] = useState<boolean>();
    const [workflowMap, setWorkflowMap] = useState<IWorkflowMap>({})
    const [form, setForm] = useState<FormInstance<ITemplate>>()

    const { showMessage } = useLayoutContext();
    const router = useRouter();
    const wfUrl = getFullUrl(RouterInfo.WORKFLOW);

    useEffect(() => {
        initial()
    }, []);

    const initial = async () => {
        setInEdit(mode === 'add');
        await fetchTemplateData();
        if (mode === 'add') {
            prepareNewWorkflow(paramObj)
        } else {
            fetchWorkflow(paramObj.id || '')
        }
    }

    const fetchTemplateData = async () => {
        const temps = (await apiCaller.get<IWorkflow[]>(`${process.env.NEXT_PUBLIC_WORKFLOW_API}`)).data;
        if (!temps) return;

        setWorkflowMap(temps.reduce<{ [id: string]: string }>((pre, temp) => {
            pre[temp.id] = temp.name
            return pre;
        }, {}))
    }

    const fetchWorkflow = async (id: string) => {
        // TODO: call API to fetch the workflow
        const wf = await (await apiCaller.get(`${process.env.NEXT_PUBLIC_WORKFLOW_API}?id=${id}`)).data
        setWorkflow(wf);
    }

    const prepareNewWorkflow = async (paramObj: IEditWorkflow) => {
        const id = '';
        const template: (ITemplate | undefined) =
            (!!paramObj.template ?
                (await apiCaller.get<ITemplate>(`${process.env.NEXT_PUBLIC_TEMPLATE_API}?id=${paramObj.template}`)).data :
                undefined);

        if (!!template) {
            /**
             * if the user assigns a template,
             * then the graph directly uses it
             */
            const id_trans = getNewIdTrans(template.flows)
            let rootId = ''
            const flows: IFlow[] = template.flows.reduce<IFlow[]>((wf, tf) => {
                if (tf.type === 'Input') rootId = id_trans[tf.id]
                wf.push({
                    ...tf,
                    id: id_trans[tf.id],
                    forwards: map(tf.forwards, f => id_trans[f])
                })
                return wf;
            }, []);
            setWorkflow({ id, name: paramObj.name || '', flows, rootNdeId: [rootId] })

        } else {
            /**
             * if the user does not assign any template,
             * then the graph will append the Input and Output nodes as initialization
             */
            const rootId = `tmp_${v4()}`
            const doneId = `tmp_${v4()}`
            const flows: IFlow[] = [
                {
                    id: doneId,
                    type: 'Output',
                    name: flowInfoMap['Output'].nodeName,
                    position: { x: X_GAP * 3, y: 0 }
                },
                {
                    id: rootId,
                    type: 'Input',
                    name: flowInfoMap['Input'].nodeName,
                    position: { x: 0, y: 0 }
                },

            ]
            setWorkflow({ id, name: paramObj.name || '', flows, rootNdeId: [rootId] })
        }
    }

    //#region old version of the logic to add new workflow 
    // const prepareNewWorkflow = async (paramObj: IEditWorkflow) => {
    //     const addId2Forwards = (_node: IFlow, id: string): void => {
    //         _node.forwards = _node.forwards || [];
    //         _node.forwards?.push(id);
    //     }
    //     const templateIds = paramObj.template?.split(',') || [];
    //     const y = 0;
    //     const rootId = `tmp_${v4()}`
    //     const doneId = `tmp_${v4()}`
    //     let x = 0, idx = 0;
    //     const flows: IFlow[] = [
    //         { id: rootId, type: 'Input', name: 'Upload', position: { x, y } }
    //     ]
    //     for (const temp_id of templateIds) {
    //         const id = `tmp_${v4()}`
    //         x += X_GAP;
    //         flows.push({
    //             id,
    //             type: 'Workflow',
    //             workflowId: temp_id,
    //             position: { x, y }
    //         });
    //         addId2Forwards(flows[idx], id);
    //         idx++;
    //     }
    //     if (!!idx) {
    //         x += X_GAP;
    //         addId2Forwards(flows[idx], doneId);
    //     } else {
    //         x += X_GAP * 3;
    //     }
    //     flows.push(
    //         {
    //             id: doneId,
    //             type: 'Output',
    //             name: 'Done',
    //             position: { x, y }
    //         }
    //     );
    //     setWorkflow({
    //         id: '',
    //         name: paramObj.name || '',
    //         flows,
    //         rootNdeId: [rootId]
    //     })
    // }
    //#endregion

    // const saveNewTemplate = async ({ name }: ITemplate) => {

    //     const old_nodes = (workflow?.flows || [])
    //     // assign new ids to nodes
    //     const id_trans: Record<string, string> = getNewIdTrans(old_nodes)

    //     // calculate new position for all nodes
    //     const startNodes = filter(old_nodes, n => { return n.type === 'Input' })
    //     const position = getNewPosition(startNodes, old_nodes);
    //     // assign new ids to nodes, and reset the node position
    //     const nodes = old_nodes.reduce<IFlow[]>((result, cur) => {
    //         result.push({
    //             ...cur,
    //             id: (id_trans[cur.id] || ''),
    //             forwards: (cur.forwards?.map(f => id_trans[f] || '').filter(i => !!i)) || [],
    //             position: position[cur.id]
    //         })
    //         return result;
    //     }, []);

    //     calculateDepth(nodes.filter(n => n.type === 'Input'), nodes);
    //     const template: ITemplate = {
    //         id: '', //v4(),
    //         rootNdeId: [],
    //         name,
    //         flows: nodes
    //     }

    //     //TODO: call API to save the template
    //     await apiCaller.post(`${process.env.NEXT_PUBLIC_TEMPLATE_API}`, template);
    //     setOpenTemplateModal(false)
    // }

    const saveNewTemplate_withRefWF = async ({ name }: ITemplate) => {

        const old_nodes = cloneDeep(workflow?.flows || []);

        // get reference wfs
        for (const ref_wf of filter(old_nodes, n => n.type === 'Workflow')) {
            const wf = await (await apiCaller.get<IWorkflow>(`${process.env.NEXT_PUBLIC_WORKFLOW_API}?id=${ref_wf.workflowId}`)).data;
            if (!!wf) {
                for (const src of filter(old_nodes, n => includes(n.forwards, ref_wf.id))) {
                    if (!src.forwards) continue;
                    remove(src.forwards, ref_wf.id);
                    src.forwards.push(...(find(wf.flows, f => f.type === 'Input')?.forwards || []))
                }
                const wf_end = find(wf.flows, f => f.type === 'Output')
                for (const tar of filter(wf.flows, n => includes(n.forwards, wf_end?.id || ''))) {
                    tar.forwards = ref_wf.forwards
                }
                old_nodes.push(...wf.flows.filter(f => !includes(['Input', 'Output'], f.type)))
                remove(old_nodes, ['id', ref_wf.id]);
            }

        }

        // assign new ids to nodes
        const id_trans: Record<string, string> = getNewIdTrans(old_nodes)

        // calculate new position for all nodes
        const startNodes = filter(old_nodes, n => { return n.type === 'Input' })
        const position = getNewPosition(startNodes, old_nodes);
        // assign new ids to nodes, and reset the node position
        const nodes = old_nodes.reduce<IFlow[]>((result, cur) => {
            result.push({
                ...cur,
                id: (id_trans[cur.id] || ''),
                forwards: (cur.forwards?.map(f => id_trans[f] || '').filter(i => !!i)) || [],
                position: position[cur.id]
            })
            return result;
        }, []);

        calculateDepth(nodes.filter(n => n.type === 'Input'), nodes);
        const template: ITemplate = {
            id: '', //v4(),
            rootNdeId: [],
            name,
            flows: nodes
        }

        //TODO: call API to save the template
        await apiCaller.post(`${process.env.NEXT_PUBLIC_TEMPLATE_API}`, template);
        setOpenTemplateModal(false)
    }

    const ifWorkflowIsCompleted = (nodes: IFlow[] = []): boolean => {
        for (const node of nodes) {
            if (node.type === 'Output') {
                if (!some(nodes, n => includes(n.forwards, node.id))) return false
            } else {
                if (!node.forwards?.length) return false;
            }
        }
        return true
    }

    const mock_run = (forwards: string[]): void => {
        let next: string[] = [];
        graphRef.current?.setNodes(pre => {
            if (includes(forwards, pre.id)) {
                next = uniq(next.concat(pre.data.forwards || []))
                return { ...pre, data: { ...pre.data, running: true } }
            }
            return pre
        });

        debounce(async () => {
            graphRef.current?.setNodes(pre => {
                if (includes(forwards, pre.id)) {
                    let status: FlowStatus = 'success';
                    let report: any = undefined;
                    if (pre.id == 'f-2') status = 'failure';
                    else if (pre.id == 'f-5') status = 'warning';

                    if (pre.data.type === 'Output') {
                        report = <>{map(range(0, 30), () => (<p>
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
            debounce(() => {
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
                    {inEdit ?
                        <>
                            <Button icon={<FontAwesomeIcon icon={faTrash} />}
                                severity='danger'
                                tooltip="Remove the workflow"
                                tooltipOptions={{ position: 'bottom' }}
                                onClick={async () => {
                                    confirmDialog({
                                        message: `Do you want to delete ${workflow?.name || 'this workflow'}?`,
                                        header: `Delete Workflow`,
                                        icon: 'pi pi-info-circle',
                                        acceptClassName: 'p-button-danger',
                                        accept: async () => {
                                            // TODO: Call API to delete this workflow
                                            const rsp = await apiCaller.delete<ApiResult>(`${process.env.NEXT_PUBLIC_WORKFLOW_API}?id=${workflow?.id || ''}`,);
                                            if (rsp.data.status === 'failure') return;
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
                                    graphRef.current?.resetAllElements();
                                    setInEdit(false)
                                }}
                            />
                            <Button className="w-[100px]" icon={<FontAwesomeIcon className='mr-[7px]' icon={faSave} />}
                                label="Save"
                                tooltipOptions={{ position: 'bottom' }}
                                onClick={async () => {
                                    const flows: IFlow[] = map(graphRef.current?.getNodes() || [], n => ({
                                        ...n.data, position: n.position
                                    }));
                                    // TODO: Call API to save the edit result
                                    setWorkflow(pre => {
                                        const result: (IWorkflow | undefined) = !!pre ? ({ ...pre, flows }) : pre
                                        if (!result) return result;
                                        calculateDepth(result.flows.filter(n => n.type === 'Input'), result.flows);
                                        if (mode === 'add') {
                                            apiCaller.post<ApiResult>(`${process.env.NEXT_PUBLIC_WORKFLOW_API}`, result);
                                        } else {
                                            apiCaller.put<ApiResult>(`${process.env.NEXT_PUBLIC_WORKFLOW_API}`, result);
                                        }
                                        return result
                                    });

                                    setInEdit(false)
                                }}
                            />
                        </> :
                        <>
                            <Button icon={<FontAwesomeIcon icon={faMagicWandSparkles} />}
                                severity='info'
                                tooltip="Save as template"
                                tooltipOptions={{ position: 'bottom' }}
                                onClick={() => {
                                    if (!ifWorkflowIsCompleted(workflow?.flows)) {
                                        showMessage({
                                            message: 'Cannot be saved as a template since the workflow is not completed.',
                                            type: 'error'
                                        })
                                        return
                                    }

                                    // TODO: will allow the reference wf save as template in step 2
                                    // if (some(workflow?.flows, (f => f.type === 'Workflow'))) {
                                    //     showMessage({
                                    //         message: `Cannot be saved as a template since we don't allow the workflow reference to be saved into a template.`,
                                    //         type: 'error'
                                    //     })
                                    //     return
                                    // }
                                    setOpenTemplateModal(true)
                                }}
                            />
                            <Button icon={<FontAwesomeIcon icon={faPlayCircle} />}
                                severity='success'
                                tooltip="Run Flow"
                                tooltipOptions={{ position: 'bottom' }}
                                onClick={async () => {
                                    if (!ifWorkflowIsCompleted(workflow?.flows)) {
                                        showMessage({
                                            message: 'Cannot run the workflow since the workflow is not completed.',
                                            type: 'error'
                                        })
                                        return
                                    }
                                    graphRef.current?.setNodes(pre => {
                                        return { ...pre, data: { ...pre.data, status: 'none', running: false } }
                                    });
                                    await new Promise(resolve => setTimeout(resolve, 500));
                                    if (!!workflow?.rootNdeId) mock_run(workflow?.rootNdeId)
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
                workflowMap={workflowMap}
            />
            <Modal
                title='Save as Template'
                visible={openTemplateModal}
                onOk={() => {
                    form?.submit()
                        .then(saveNewTemplate_withRefWF)
                        .catch(() => {
                            // 
                        });
                }}
                onCancel={() => {
                    setOpenTemplateModal(false)
                }}>
                <Form
                    onLoad={(form: FormInstance<ITemplate>) => setForm(form)}
                    onDestroyed={() => {
                        setForm(undefined)
                    }}
                    onSubmit={saveNewTemplate_withRefWF}
                >
                    {
                        ({ Item }) => (
                            <>
                                <Item name={'name'} label="Template Name" rules={{ required: 'Please give a template name!' }}>
                                    <InputText />
                                </Item>
                            </>
                        )
                    }</Form>
            </Modal>
        </div>
    </div>
}