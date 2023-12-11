'use client'
import { faCancel, faMagicWandSparkles, faPen, faPlayCircle, faSave, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cloneDeep, filter, includes, map, remove, toString } from "lodash";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from 'primereact/button';
import { confirmDialog } from "primereact/confirmdialog";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import { v4 } from "uuid";

import apiCaller from "@/api-helpers/api-caller";
import { coverSearchParamsToObj } from "@/api-helpers/url-helper";
import FileUploader from "@/components/file-uploader";
import FlowGraph from "@/components/flow-editor";
import { flowInfoMap } from "@/components/flow-editor/configuration";
import { IWorkflowMap } from "@/components/flow-editor/context";
import { X_GAP, calculateDepth, getNewIdTrans, ifWorkflowIsCompleted, resetPosition_x, resetPosition_y } from "@/components/flow-editor/helper";
import Form from "@/components/form";
import { FormInstance } from "@/components/form/form";
import { useGraphRef } from "@/components/graph/helper";
import Modal from "@/components/modal";
import TitlePane from "@/components/title-pane";
import { ApiResult } from "@/interface/api";
import { IEditWorkflow, IFlowNode, IWorkflow } from "@/interface/workflow";
import { useLayoutContext } from "@/layout/turbo-layout/context";
import { useWfLayoutContext } from "@/layout/workflow-layout/context";
import RouterInfo, { getFullUrl } from "@/settings/router-setting";

type EditMode = 'add' | 'normal'

export default function Page() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const wfUrl = getFullUrl(RouterInfo.WORKFLOW);
    const paramObj = coverSearchParamsToObj<IEditWorkflow>(searchParams);
    const [mode, setMode] = useState<EditMode>(!!paramObj.id ? 'normal' : 'add')
    const { graphRef } = useGraphRef<IFlowNode, any>();
    const { showMessage } = useLayoutContext();
    const { runWorkflow } = useWfLayoutContext()

    const [workflow, setWorkflow] = useState<IWorkflow>();
    const [inEdit, setInEdit] = useState<boolean>();
    const [openTemplateModal, setOpenTemplateModal] = useState<boolean>();
    const [workflowMap, setWorkflowMap] = useState<IWorkflowMap>({})
    const [form, setForm] = useState<FormInstance<IWorkflow>>()
    const [openUpload, setOpenUpload] = useState<boolean>(false);


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
        const wfs = (await apiCaller.get<ApiResult<IWorkflow[]>>(`${process.env.NEXT_PUBLIC_FLOWS_API}/WORKFLOW`)).data.data;
        if (!wfs) return;

        setWorkflowMap(wfs.reduce<{ [id: string]: string }>((pre, wf) => {
            if (wf.id !== paramObj?.id) pre[wf.id] = wf.name
            return pre;
        }, {}))
    }

    const fetchWorkflow = async (id: string) => {
        const wf = await (await apiCaller.get<ApiResult<IWorkflow>>(`${process.env.NEXT_PUBLIC_FLOW_API}/${id}`)).data.data
        setWorkflow(wf);
    }

    const prepareNewWorkflow = async (paramObj: IEditWorkflow) => {
        const id = '';
        const template: (IWorkflow | undefined) =
            (!!paramObj.template ?
                (await apiCaller.get<ApiResult<IWorkflow>>(`${process.env.NEXT_PUBLIC_FLOW_API}/${paramObj.template}`)).data.data :
                undefined);

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
            setWorkflow({ type: 'workflow', id, name: paramObj.name || '', flows, rootNdeId: [rootId] })

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
            setWorkflow({ type: 'workflow', id, name: paramObj.name || '', flows, rootNdeId: [rootId] })
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

    const saveToNewTemplate = async (nodes: IFlowNode[], name: string) => {
        // assign new ids to nodes
        const id_trans: Record<string, string> = getNewIdTrans(nodes)

        // calculate new position for all nodes
        const input_id = nodes.find(n => n.type === 'Input')?.id || ''
        resetPosition_x(nodes, [input_id]);
        resetPosition_y(nodes, [input_id]);
        // assign new ids to nodes, and reset the node position
        const _nodes = nodes.reduce<IFlowNode[]>((result, cur) => {
            result.push({
                ...cur,
                id: (id_trans[cur.id] || ''),
                forwards: (cur.forwards?.map(f => id_trans[f] || '').filter(i => !!i)) || [],
            })
            return result;
        }, []);

        calculateDepth(_nodes.filter(n => n.type === 'Input'), _nodes);
        const template: IWorkflow = {
            type: 'template',
            id: '', //v4(),
            rootNdeId: [],
            name,
            flows: _nodes
        }

        await apiCaller.post<ApiResult>(`${process.env.NEXT_PUBLIC_FLOW_API}`, template);
        setOpenTemplateModal(false)
    }

    const expandRefWF = async (nodes: IFlowNode[]) => {
        const _nodes = cloneDeep(nodes || []);
        /**
         * get all reference nodes from input nodes
         */
        const ref_wfs = filter(_nodes, n => n.type === 'Workflow')

        /**
         * get all workflows by reference nodes,
         * and use the workflows instead of all reference nodes. 
         */
        for (const ref_wf of ref_wfs) {
            const wf = await (await apiCaller.get<ApiResult<IWorkflow>>(`${process.env.NEXT_PUBLIC_FLOW_API}/${ref_wf.workflowid}`)).data.data;
            if (!wf) continue;

            /**
             * first, expand the reference nodes in the workflow
             */
            const wf_flows = await expandRefWF(wf.flows);

            /**
             * get the workflow start node and end node.
             * and remove the starrt node and end node from the flows of workflow
             */
            let wf_start: IFlowNode | undefined, wf_end: IFlowNode | undefined

            for (const flow of wf_flows) {
                if (!includes(['Input', 'Output'], flow.type)) continue;
                if (flow.type === 'Input') wf_start = flow;
                if (flow.type === 'Output') wf_end = flow;
                remove(wf_flows, flow)
            }

            /**
             * get all source nodes of reference node,
             * and put all of forwards of workflow start node to all forwards of source nodes,
             * to instead of reference node.
             */
            const sources = filter(_nodes, n => includes(n.forwards, ref_wf.id));
            for (const src of sources) {
                if (!src.forwards) continue;
                remove(src.forwards, ref_wf.id);
                src.forwards.push(...(wf_start?.forwards || []))
            }

            /**
             * get all source nodes of workflow end node.
             * also, put all of forwards of reference nodes to the forwards of workflow end node,
             * to instead of reference node.
             */
            const wf_end_sources = filter(wf_flows, n => includes(n.forwards, wf_end?.id || ''));
            for (const wf_end_src of wf_end_sources) {
                wf_end_src.forwards = ref_wf.forwards
            }

            /**
             * at the end, push the workflow to the node instead of reference node
             */
            _nodes.push(...wf_flows)
            remove(_nodes, ['id', ref_wf.id]);
        }

        /**
         * have to trans the node id before return
         */
        const id_trans: Record<string, string> = getNewIdTrans(_nodes);
        return _nodes.reduce<IFlowNode[]>((result, cur) => {
            result.push({
                ...cur,
                id: (id_trans[cur.id] || ''),
                forwards: (cur.forwards?.map(f => id_trans[f] || '').filter(i => !!i)) || [],
            })
            return result;
        }, []);
    }


    // const mock_run = (forwards: string[]): void => {
    //     let next: string[] = [];
    //     graphRef.current?.setNodes(pre => {
    //         if (includes(forwards, pre.id)) {
    //             next = uniq(next.concat(pre.data.forwards || []))
    //             return { ...pre, data: { ...pre.data, running: true } }
    //         }
    //         return pre
    //     });

    //     debounce(async () => {
    //         graphRef.current?.setNodes(pre => {
    //             if (includes(forwards, pre.id)) {
    //                 let status: FlowStatus = 'success';
    //                 let report: any = undefined;
    //                 if (pre.id == 'f-2') status = 'failure';
    //                 else if (pre.id == 'f-5') status = 'warning';

    //                 if (pre.data.type === 'Output') {
    //                     report = <>{map(range(0, 30), () => (<p>
    //                         <p className="m-0">
    //                             Next.js is a React framework for building full-stack web applications. You use React Components to build user interfaces, and Next.js for additional features and optimizations.
    //                         </p>
    //                         <p className="m-0">
    //                             Under the hood, Next.js also abstracts and automatically configures tooling needed for React, like bundling, compiling, and more. This allows you to focus on building your application instead of spending time with configuration.
    //                         </p>
    //                         <p className="m-0">
    //                             Whether you re an individual developer or part of a larger team, Next.js can help you build interactive, dynamic, and fast React applications.
    //                         </p>
    //                     </p>))}</>
    //                 }

    //                 return { ...pre, data: { ...pre.data, status: status, running: false, report } }
    //             }
    //             return pre
    //         });
    //         debounce(() => {
    //             if (!!next.length) mock_run(next);
    //             else {
    //                 showMessage('workflow is done')
    //             }
    //         }, 500)()
    //     }, 3000)()
    // }

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
                                    if (!workflow) return;
                                    const flows: IFlowNode[] = map(graphRef.current?.getNodes() || [], n => ({
                                        ...n.data, position: n.position
                                    }));

                                    const result: IWorkflow = ({ ...workflow, flows })

                                    const res = (mode === 'add' ?
                                        await apiCaller.post<ApiResult>(`${process.env.NEXT_PUBLIC_CREATEFLOW}`, result) :
                                        await apiCaller.post<ApiResult>(`${process.env.NEXT_PUBLIC_UPDATEFLOW}`, result)
                                    )

                                    if (res.data.status !== 'ok' && res.data.status !== 'success') {
                                        showMessage({
                                            message: res.data.message || 'Add failure',
                                            type: 'error'
                                        })
                                        return;
                                    }

                                    setWorkflow(result);
                                    setInEdit(false);
                                    setMode('normal')
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
                                    setOpenTemplateModal(true)
                                }}
                            />
                            <Button icon={<FontAwesomeIcon icon={faPlayCircle} />}
                                severity='success'
                                tooltip="Run Flow"
                                tooltipOptions={{ position: 'bottom' }}
                                onClick={async () => {
                                    runWorkflow(workflow)
                                    // if (!ifWorkflowIsCompleted(workflow?.flows)) {
                                    //     showMessage({
                                    //         message: 'Cannot run the workflow since the workflow is not completed.',
                                    //         type: 'error'
                                    //     })
                                    //     return
                                    // }
                                    // setOpenUpload(true);
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
                        .then(async ({ name }) => {
                            const nodes = await expandRefWF(workflow?.flows || [])
                            await saveToNewTemplate(nodes, name)
                        })
                        .catch(() => {
                            // 
                        });
                }}
                onCancel={() => {
                    setOpenTemplateModal(false)
                }}>
                <Form
                    onLoad={(form: FormInstance<IWorkflow>) => setForm(form)}
                    onDestroyed={() => {
                        setForm(undefined)
                    }}
                    onSubmit={async ({ name }) => {
                        const nodes = await expandRefWF(workflow?.flows || []);
                        await saveToNewTemplate(nodes, name)
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
                    }</Form>
            </Modal>
            <Modal
                title={`Upload files to Run '${workflow?.name}'(${workflow?.id})`}
                visible={openUpload}
                onOk={() => setOpenUpload(false)}
                footerClass="flex justify-end"
                okLabel="Cancel"
            >
                <FileUploader
                    uploadLabel="Upload & Run"
                    onUpload={e => {
                        if (workflow && e.files && e.files.length > 0) {
                            const formData = new FormData();
                            for (const i in e.files) {
                                formData.append('files', e.files[i])
                            }

                            formData.append('userId', '23224');
                            formData.append('workflowId', workflow.id);
                            formData.append('version', '1');

                            apiCaller.post<ApiResult>(`${process.env.NEXT_PUBLIC_REPORT}/run`, formData, {
                                headers: {
                                    "Content-Type": "multipart/form-data",
                                    // "x-rapidapi-host": "file-upload8.p.rapidapi.com",
                                    // "x-rapidapi-key": "your-rapidapi-key-here",
                                },
                            }).then((rep) => {
                                showMessage({
                                    message: rep.data.message || 'success',
                                    type: 'success'
                                })
                                setOpenUpload(false);
                            }).catch((error) => {
                                showMessage({
                                    message: toString(error),
                                    type: 'error'
                                })
                            });
                        }
                    }}
                />
            </Modal>
        </div>
    </div>
}