'use client'
import { faCancel, faMagicWandSparkles, faPen, faPlayCircle, faSave, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import _ from "lodash";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from 'primereact/button';
import { confirmDialog } from "primereact/confirmdialog";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import { XYPosition } from "reactflow";
import { v4 } from "uuid";

import FlowGraph from "@/components/flow-editor";
import Form from "@/components/form";
import { FormInstance } from "@/components/form/form";
import { useGraphRef } from "@/components/graph/helper";
import Modal from "@/components/modal";
import TitlePane from "@/components/title-pane";
import { FlowStatus, IEditWorkflow, IFlow, ITemplate, IWorkflow } from "@/interface/workflow";
import { useLayoutContext } from "@/layout/context";
import { mock_templates, mock_workflows } from "@/mock-data/mock";
import RouterInfo, { getFullUrl } from "@/settings/router-setting";
import { coverSearchParamsToObj } from "@/untils/urlHelper";

type EditMode = 'add' | 'normal'


export default function Page() {
    const searchParams = useSearchParams()
    const [workflow, setWorkflow] = useState<IWorkflow>();
    const { graphRef } = useGraphRef<IFlow, any>();
    const [inEdit, setInEdit] = useState<boolean>();
    const [openTemplateModal, setOpenTemplateModal] = useState<boolean>();
    const [form, setForm] = useState<FormInstance<ITemplate>>()

    const { showMessage } = useLayoutContext();
    const router = useRouter();
    const wfUrl = getFullUrl(RouterInfo.WORKFLOW);

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
    }, []);

    const getNewPosition = (nodes: IFlow[], x = 0, y = 0): Record<string, XYPosition> => {
        const X_GAP = 430, Y_GAP = 150;
        return nodes
            .sort((a, b) => (a.position.y < b.position.y ? -1 : 1))
            .reduce<Record<string, XYPosition>>((result, node) => {
                const forwars_nodes = _.filter(workflow?.flows, n => _.includes(node.forwards, n.id))
                const merge = _.mergeWith(
                    result,
                    getNewPosition(forwars_nodes, x + X_GAP, y),
                    (obj, src) => {
                        return { x: _.max([(obj || src).x, src.x || 0]), y: _.min([(obj || src).y, src.y]) }
                    }
                );

                result = {
                    ...merge,
                    [node.id]: { x, y }
                }
                y += Y_GAP;

                return result;
            }, {})
    }

    const saveNewTemplate = ({ name }: ITemplate) => {

        const old_nodes = (workflow?.flows || [])
        // assign new ids to nodes
        const id_trans: Record<string, string> =
            old_nodes.reduce<Record<string, string>>((result, cur) => {
                result[cur.id] = v4();
                return result
            }, {});

        // calculate new position for all nodes
        const startNodes = _.filter(old_nodes, n => { return n.type === 'file-upload' })
        const position = getNewPosition(startNodes);
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

        const template: ITemplate = { id: v4(), name, flows: nodes }
        //TODO: call API to save the template
        mock_templates.push(template);
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
                                            _.remove(mock_workflows, ['id', workflow?.id || ''])
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
                                    setWorkflow(pre => !!pre ? ({ ...pre, flows }) : pre)
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
                >
                    {
                        Item => (
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