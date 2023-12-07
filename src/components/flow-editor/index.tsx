import _, { includes, map } from "lodash";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Fieldset } from "primereact/fieldset";
import { FileUpload } from "primereact/fileupload";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { SelectItem } from "primereact/selectitem";
import { Tooltip } from "primereact/tooltip";
import { useEffect, useState } from "react";
import { Connection, Edge, Node } from 'reactflow'
import { v4 } from "uuid";

import DndList from "../dnd-list";
import Form from "../form";
import { FormInstance } from "../form/form";
import Graph from "../graph";
import { GraphProps } from "../graph/graph";
import { useGraphRef } from "../graph/helper";
import Modal from "../modal";

import { EDGE_DEF_SETTING, REPORT_ITEMS } from "./configuration";
import { FlowGrapContext, IWorkflowMap } from "./context";
import { TurboEdgeAsset } from "./graph-assets/turbo-edge";
import TurboNode from "./graph-assets/turbo-node";
import ReportItem from "./report-item";

import { FlowTyep, IFlowNode, IFlowNodeBase } from "@/interface/workflow";

import './graph-assets/turbo-elements.css';
import './flow-editor.css';

interface FlowGraphProps extends Omit<GraphProps<IFlowNode>,
    'initialNodes' |
    'initialEdges' |
    'nodeTypes' |
    'edgeTypes' |
    'defaultEdgeOptions' |
    'onConnect' |
    'onEdgesDelete' |
    'readonly'> {
    flows: IFlowNode[];
    inEdit?: boolean;
    workflowMap: IWorkflowMap
}

const UNREMOVABLE_TYPES: FlowTyep[] = ['Input', 'Output']

export default function FlowGraph({ flows, inEdit = false, graphRef: ref, workflowMap, ...others }: FlowGraphProps) {

    const [onDragItem, setOnDragItem] = useState<IFlowNodeBase>();
    const [initialEdges, setInitialEdges] = useState<Edge<any>[]>([]);
    const [initialNodes, setInitialNodes] = useState<Node<IFlowNode>[]>([]);
    const [promptForm, setPromptForm] = useState<FormInstance<IFlowNode>>()
    const [tempForm, setTempForm] = useState<FormInstance<IFlowNode>>()
    const { graphRef } = useGraphRef<IFlowNode, any>(ref);
    const [openModal, setOpenModal] = useState<IFlowNode>();

    const clickOnSetting = (flow: IFlowNode) => {
        setOpenModal(flow)
    }
    const setPrompt = () => {
        const val = promptForm?.getValues();
        if (!val) return
        graphRef.current.setNode(val.id, pre => ({ ...pre, data: { ...pre.data, prompt: val.prompt, name: val.name } }))
        setOpenModal(undefined);
    }

    const setTemplate = () => {
        const val = tempForm?.getValues();
        if (!val) return
        graphRef.current.setNode(val.id, pre => ({ ...pre, data: { ...pre.data, workflowId: val.workflowId } }))
        setOpenModal(undefined);
    }

    const closeModal = () => { setOpenModal(undefined) }

    useEffect(() => {
        const edges: Edge[] = [];
        const nodes = _.map<IFlowNode, Node<IFlowNode>>(flows, flow => {
            const { id, position, forwards } = flow;
            _.forEach(forwards, fw => {
                edges.push({ id: `${flow.id}-${fw}`, source: flow.id, target: fw, deletable: inEdit })
            })
            return ({
                id,
                position,
                type: 'turbo',
                data: flow,
                selectable: inEdit,
                deletable: !includes(UNREMOVABLE_TYPES, flow.type)
            })
        });
        setInitialEdges(edges);
        setInitialNodes(nodes);
        graphRef.current.resetAllElements(nodes, edges);
    }, [flows]);

    useEffect(() => {
        graphRef.current.setNodes(n => ({ ...n, selectable: inEdit, selected: false }));
        graphRef.current.setEdges(e => ({ ...e, deletable: inEdit, selected: false, }));
    }, [inEdit]);

    return <FlowGrapContext.Provider value={{ inEdit, clickOnSetting, workflowMap }}>
        <div className="flow-editor h-full w-full relative">
            {inEdit && <div className={`absolute 
            z-20 
            top-[22px] 
            px-[7px] 
            py-[3px] 
            left-[22px] 
            right-[22px] 
            rounded-std 
            bg-opacity-50 
            bg-deep-weak`} >
                <Tooltip target={'.report-item'} position='top' />
                <DndList
                    className="rounded-std"
                    items={REPORT_ITEMS}
                    disableChangeOrder
                    renderContent={(data) => <ReportItem
                        {...data}
                    />}
                    onDragStart={(init, item): void => {
                        setOnDragItem(() => item)
                    }}
                    direction='horizontal'
                />
            </div>}
            <Graph
                initialEdges={initialEdges}
                initialNodes={initialNodes}
                className="rounded-std bg-deep"
                nodeTypes={{ turbo: TurboNode }}
                defaultEdgeOptions={EDGE_DEF_SETTING}
                readonly={!inEdit}
                graphRef={graphRef}
                onConnect={(connection: Connection) => {
                    const { source, target } = connection
                    if (!source || !target) return;
                    const id = `${source}=${target}`
                    graphRef?.current?.addEdge({ id, source, target, ...EDGE_DEF_SETTING });
                    graphRef?.current?.setNode(source, (pre) => {
                        pre.data.forwards?.push(target);
                        return pre
                    })
                }}
                onEdgesDelete={(e) => {
                    const edge = e[0];
                    if (!edge) return;
                    const { source, target } = edge;
                    graphRef.current.setNode(source, pre => {
                        if (!pre.data.forwards) return pre
                        const idx = pre.data.forwards?.indexOf(target);
                        pre.data.forwards.splice(idx, 1);
                        return pre
                    })
                }}
                onNodesDelete={(n) => {
                    const node = n[0];
                    if (!node) return;
                    const { id } = node;
                    graphRef.current.setNodes(pre => {
                        if (!pre.data.forwards?.includes(id)) return pre;
                        const idx = pre.data.forwards.indexOf(id);
                        pre.data.forwards.splice(idx, 1);
                        return pre
                    })
                }}
                onMouseUp={(e, position) => {
                    if (!onDragItem || !position) return;
                    const id = `tmp_${v4()}`;
                    graphRef.current?.addNode({
                        id, position,
                        data: {
                            ...onDragItem,
                            id, position, forwards: []
                        }, type: 'turbo'
                    });
                    setOnDragItem(() => undefined);
                }}
                fitView
                {...others}
            >
                <TurboEdgeAsset />
            </Graph>
            <Modal
                title="Set the prompt"
                onOk={setPrompt}
                onCancel={closeModal}
                visible={openModal?.type === 'Normal'}
            >
                <Form
                    defaultValues={openModal}
                    onLoad={form => setPromptForm(form)}
                    onDestroyed={() => setPromptForm(undefined)}>{
                        ({ Item }) =>
                            <>
                                <Item name='name' label="Name" >
                                    <InputText />
                                </Item>
                                <Item name='prompt' label="Prompt" >
                                    <InputTextarea className="w-full min-h-[100px]" />
                                </Item>
                            </>
                    }
                </Form>
            </Modal>
            <Modal
                title="Upload your files"
                onOk={() => setOpenModal(undefined)}
                okLabel="Close"
                visible={openModal?.type === 'Input'}
            >
                <FileUpload name="upload" url={''}
                    mode='advanced'
                    multiple
                    accept="*"
                    maxFileSize={1000000}
                    emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>}
                    itemTemplate={<></>}
                />
            </Modal>
            <Modal
                className="preview-doc-modal"
                onOk={() => setOpenModal(undefined)}
                okLabel="Close"
                visible={openModal?.type === 'Output'}
                contentClassName="flex"
                footer={<div className="flex justify-center">
                    {<Button label='Download' severity='secondary' onClick={() => {
                        // download
                    }} />}
                    {<Button label='Close' onClick={() => setOpenModal(undefined)} />}
                </div>}
            >
                <Fieldset legend="Preview your report" className="w-full" >
                    {openModal?.report || ''}
                </Fieldset>
            </Modal>
            <Modal
                title="Workflow Reference"
                onOk={setTemplate}
                onCancel={closeModal}
                visible={openModal?.type === 'Workflow'}
            >
                <Form
                    defaultValues={openModal}
                    onLoad={form => setTempForm(form)}
                    onDestroyed={() => setTempForm(undefined)}>
                    {
                        ({ Item }) =>
                        (<>
                            <Item name='workflowId' label="Select a reference workflow" >
                                <Dropdown options={map<IWorkflowMap, SelectItem>(workflowMap, (v, k) => ({ label: v, value: k }))} />
                            </Item>
                        </>)
                    }
                </Form>
            </Modal>
        </div>
    </FlowGrapContext.Provider>
}

