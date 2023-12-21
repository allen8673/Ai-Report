import { find, forEach, includes, map } from "lodash";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { SelectItem } from "primereact/selectitem";
import { Tooltip } from "primereact/tooltip";
import { useEffect, useState } from "react";
import { Connection, Edge, Node, NodeRemoveChange, NodeTypes } from 'reactflow'
import { v4 } from "uuid";

import DndList from "../dnd-list";
import ErrorBoundary from "../error-boundary";
import Form from "../form";
import { FormInstance } from "../form/form";
import Graph from "../graph";
import { useGraphRef } from "../graph/helper";
import Modal from "../modal";

import { EDGE_DEF_SETTING, GET_REPORT_ITEMS } from "./configuration";
import { FlowGrapContext } from "./context";
import { TurboEdgeAsset } from "./graph-assets/turbo-edge";
import TurboNode from "./graph-assets/turbo-node";
import ReportItem from "./report-item";
import { FlowGraphProps, FlowNameMapper } from "./type";

import { FlowTyep, IFlowNode, IFlowNodeBase } from "@/interface/flow";

import './graph-assets/turbo-elements.css';
import './flow-editor.css';


const nodeType: NodeTypes = { turbo: TurboNode }
const UNREMOVABLE_TYPES: FlowTyep[] = ['Input', 'Output']

export default function FlowEditor(props: FlowGraphProps) {
    const {
        flows,
        inEdit = false,
        graphRef: ref,
        flowNameMapper,
        delayRender,
        componentData,
        ...others } = props
    const [onDragItem, setOnDragItem] = useState<IFlowNodeBase>();
    const [initialEdges, setInitialEdges] = useState<Edge<any>[]>([]);
    const [initialNodes, setInitialNodes] = useState<Node<IFlowNode>[]>([]);
    const [promptForm, setPromptForm] = useState<FormInstance<IFlowNode>>()
    const [wfRefForm, setWfRefForm] = useState<FormInstance<IFlowNode>>()
    const [reportForm, setReportForm] = useState<FormInstance<IFlowNode>>()
    const { graphRef } = useGraphRef<IFlowNode, any>(ref);
    const [openModal, setOpenModal] = useState<IFlowNode>();

    const clickOnSetting = (flow: IFlowNode) => {
        setOpenModal(flow)
    }
    const setPrompt = () => {
        promptForm?.submit()
            .then(({ id, prompt, name, apimode }) => {
                graphRef.current.setNode(id, pre => ({
                    ...pre,
                    data: {
                        ...pre.data,
                        prompt: prompt,
                        name: name,
                        apimode: apimode
                    }
                }))
                setOpenModal(undefined);
            }).catch(() => {
                // 
            });
    }

    const setWorkflowRef = () => {
        const val = wfRefForm?.getValues();
        if (!val) return
        graphRef.current.setNode(val.id, pre => ({ ...pre, data: { ...pre.data, workflowid: val.workflowid, workflowstatus: 'enable' } }))
        setOpenModal(undefined);
    }

    const setReport = () => {
        reportForm?.submit()
            .then(({ id, prompt, name, fileName, apimode }) => {
                graphRef.current.setNode(id, pre => ({
                    ...pre,
                    data: {
                        ...pre.data,
                        prompt: prompt,
                        name: name,
                        fileName: fileName,
                        apimode: apimode
                    }
                }));
                setOpenModal(undefined);
            })
    }

    const closeModal = () => { setOpenModal(undefined) }

    useEffect(() => {
        const edges: Edge[] = [];
        const nodes = map<IFlowNode, Node<IFlowNode>>(flows, flow => {
            const { id, position, forwards } = flow;
            forEach(forwards, fw => {
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
        setTimeout(() => {
            graphRef.current.resetAllElements(nodes, edges);
        }, delayRender);
    }, [flows]);

    useEffect(() => {
        graphRef.current.setNodes(n => ({ ...n, selectable: inEdit, selected: false }));
        graphRef.current.setEdges(e => ({ ...e, deletable: inEdit, selected: false, }));
    }, [inEdit]);

    return <ErrorBoundary>
        <FlowGrapContext.Provider value={{ inEdit, clickOnSetting, flowNameMapper, graphRef }}>
            <div className="flow-editor h-full w-full relative">
                {inEdit && <div className={`
                absolute z-20  
                top-[22px] left-[22px] right-[22px] px-[7px] py-[3px] 
                rounded-std bg-deep-weak/[.5]`} >
                    <Tooltip target={'.report-item'} position='top' />
                    <DndList
                        className="rounded-std"
                        items={GET_REPORT_ITEMS(props)}
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
                    nodeTypes={nodeType}
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
                    onNodesChange={(changes) => {
                        const change = find(changes, ['type', 'remove'])
                        if (!!change) {
                            const { id } = change as NodeRemoveChange;
                            graphRef.current.setNodes(pre => {
                                if (!pre.data.forwards?.includes(id)) return pre;
                                const idx = pre.data.forwards.indexOf(id);
                                pre.data.forwards.splice(idx, 1);
                                return pre
                            })
                        }
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
                    onOk={inEdit ? setPrompt : undefined}
                    onCancel={closeModal}
                    cancelLabel={inEdit ? undefined : 'Close'}
                    visible={openModal?.type === 'Normal'}
                >
                    <Form
                        readonly={!inEdit}
                        defaultValues={openModal}
                        onLoad={form => setPromptForm(form)}
                        onDestroyed={() => setPromptForm(undefined)}>{
                            ({ Item }) =>
                                <>
                                    <Item name='apimode' label="API Mode" rules={{ required: 'Please select an API mode!' }}>
                                        <Dropdown options={componentData?.filter(i => i.COMP_TYPE === 'Normal').map(i => ({ label: i.COMP_NAME, value: i.APIMODE }))} />
                                    </Item>
                                    <Item name='name' label="Name" >
                                        <InputText />
                                    </Item>
                                    <Item name='prompt' label="Prompt" >
                                        <InputTextarea autoResize className="w-full min-h-[100px]" />
                                    </Item>
                                </>
                        }
                    </Form>
                </Modal>
                <Modal
                    title="Workflow Reference"
                    onOk={inEdit ? setWorkflowRef : undefined}
                    onCancel={closeModal}
                    cancelLabel={inEdit ? undefined : 'Close'}
                    visible={openModal?.type === 'Workflow'}
                >
                    <Form
                        readonly={!inEdit}
                        defaultValues={openModal}
                        onLoad={form => setWfRefForm(form)}
                        onDestroyed={() => setWfRefForm(undefined)}>
                        {
                            ({ Item }) =>
                            (<>
                                <Item name='workflowid' label="Select a reference workflow" >
                                    <Dropdown disabled options={map<FlowNameMapper, SelectItem>(flowNameMapper, (v, k) => ({ label: v, value: k }))} />
                                </Item>
                            </>)
                        }
                    </Form>
                </Modal>
                <Modal
                    title="Set the report link"
                    onOk={inEdit ? setReport : undefined}
                    onCancel={closeModal}
                    cancelLabel={inEdit ? undefined : 'Close'}
                    visible={openModal?.type === 'Report'}
                >
                    <Form
                        readonly={!inEdit}
                        defaultValues={openModal}
                        onLoad={form => setReportForm(form)}
                        onDestroyed={() => setReportForm(undefined)}>{
                            ({ Item }) =>
                                <>
                                    <Item name='apimode' label="API Mode" disabled defaultValue={'report'}>
                                        <Dropdown options={componentData?.filter(i => i.COMP_TYPE === 'Report').map(i => ({ label: i.COMP_NAME, value: i.APIMODE }))} />
                                    </Item>
                                    <Item name='fileName' label="File" >
                                        <Dropdown options={['file_1', 'file_2']} />
                                    </Item>
                                    <Item name='name' label="Name" >
                                        <InputText />
                                    </Item>
                                    <Item name='prompt' label="Prompt" >
                                        <InputTextarea autoResize className="w-full min-h-[100px]" />
                                    </Item>
                                </>
                        }
                    </Form>
                </Modal>
            </div>
        </FlowGrapContext.Provider>
    </ErrorBoundary >
}

