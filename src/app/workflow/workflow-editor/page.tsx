'use client'
import { faCancel, faMagicWandSparkles, faPen, faPlayCircle, faSave, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import _ from "lodash";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from 'primereact/button';
import { confirmDialog } from "primereact/confirmdialog";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import { v4 } from "uuid";

import apiCaller from "@/api-helpers/api-caller";
import { coverSearchParamsToObj } from "@/api-helpers/url-helper";
import FlowGraph from "@/components/flow-editor";
import { X_GAP, calculateDepth, getNewPosition } from "@/components/flow-editor/helper";
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
    const [templateMap, setTemplateMap] = useState<{ [id: string]: string }>({})
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
        const temps = (await apiCaller.get<ITemplate[]>(`${process.env.NEXT_PUBLIC_TEMPLATE_API}`)).data;
        if (!temps) return;

        setTemplateMap(temps.reduce<{ [id: string]: string }>((pre, temp) => {
            pre[temp.id] = temp.name
            return pre;
        }, {}))
    }

    const fetchWorkflow = async (id: string) => {
        // TODO: call API to fetch the workflow
        const res = await apiCaller.get(`${process.env.NEXT_PUBLIC_WORKFLOW_API}?id=${id}`)
        setWorkflow(res.data);
    }

    const prepareNewWorkflow = async (paramObj: IEditWorkflow) => {
        const addId2Forwards = (_node: IFlow, id: string): void => {
            _node.forwards = _node.forwards || [];
            _node.forwards?.push(id);
        }

        const templateIds = paramObj.template?.split(',') || [];
        const y = 0;
        const rootId = `tmp_${v4()}`
        const doneId = `tmp_${v4()}`
        let x = 0, idx = 0;
        const flows: IFlow[] = [
            { id: rootId, type: 'Input', name: 'Upload', position: { x, y } }
        ]

        for (const temp_id of templateIds) {
            const id = `tmp_${v4()}`
            x += X_GAP;
            flows.push({
                id,
                type: 'Workflow',
                workflowId: temp_id,
                position: { x, y }
            });

            addId2Forwards(flows[idx], id);
            idx++;
        }

        if (!!idx) {
            x += X_GAP;
            addId2Forwards(flows[idx], doneId);
        } else {
            x += X_GAP * 3;
        }

        flows.push(
            {
                id: doneId,
                type: 'Output',
                name: 'Done',
                position: { x, y }
            }
        );

        setWorkflow({
            id: '',
            name: paramObj.name || '',
            flows,
            rootNdeId: [rootId]
        })
    }

    const saveNewTemplate = async ({ name }: ITemplate) => {

        const old_nodes = (workflow?.flows || [])
        // assign new ids to nodes
        const id_trans: Record<string, string> =
            old_nodes.reduce<Record<string, string>>((result, cur) => {
                result[cur.id] = `tmp_${v4()}`;
                return result
            }, {});

        // calculate new position for all nodes
        const startNodes = _.filter(old_nodes, n => { return n.type === 'Input' })
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

                    if (pre.data.type === 'Output') {
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
                                    const flows: IFlow[] = _.map(graphRef.current?.getNodes() || [], n => ({
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
                                    setOpenTemplateModal(true)
                                }}
                            />
                            <Button icon={<FontAwesomeIcon icon={faPlayCircle} />}
                                severity='success'
                                tooltip="Run Flow"
                                tooltipOptions={{ position: 'bottom' }}
                                onClick={async () => {
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
                templateMap={templateMap}
            />
            <Modal
                title='Save as Template'
                visible={openTemplateModal}
                onOk={() => {
                    form?.submit()
                        .then(saveNewTemplate)
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
                    onSubmit={saveNewTemplate}
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