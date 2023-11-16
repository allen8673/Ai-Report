import _ from "lodash";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
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
import { FlowGrapContext } from "./context";
import TurboEdge, { TurboEdgeAsset } from "./graph-assets/turbo-edge";
import TurboNode from "./graph-assets/turbo-node";
import ReportItem from "./report-item";

import { IFlow, IFlowBase } from "@/interface/workflow";

import './graph-assets/turbo-node.css';

interface FlowGraphProps extends Omit<GraphProps<IFlow>,
    'initialNodes' |
    'initialEdges' |
    'nodeTypes' |
    'edgeTypes' |
    'defaultEdgeOptions' |
    'onConnect' |
    'onEdgesDelete' |
    'readonly'> {
    flows: IFlow[];
    inEdit?: boolean;
}

export default function FlowGraph({ flows, inEdit, graphRef: ref, ...others }: FlowGraphProps) {

    const [onDragItem, setOnDragItem] = useState<IFlowBase>();
    const [initialEdges, setInitialEdges] = useState<Edge<any>[]>([]);
    const [initialNodes, setInitialNodes] = useState<Node<IFlow>[]>([]);
    const [form, setForm] = useState<FormInstance<IFlow>>()
    const { graphRef } = useGraphRef<IFlow, any>(ref);
    const [openModal, setOpenModal] = useState<IFlow>();


    const clickOnSetting = (flow: IFlow) => {
        setOpenModal(flow)
    }
    const onOk = () => {
        const val = form?.getValues();
        if (!val) return
        graphRef.current.setNode(val.id, pre => ({ ...pre, data: { ...pre.data, promt: val.promt, name: val.name } }))
        setOpenModal(undefined);
    }
    const onCancel = () => { setOpenModal(undefined) }

    useEffect(() => {
        const edges: Edge[] = [];
        const nodes = _.map<IFlow, Node<IFlow>>(flows, flow => {
            const { id, position, forwards } = flow;
            _.forEach(forwards, fw => {
                edges.push({ id: `${flow.id}-${fw}`, source: flow.id, target: fw, deletable: inEdit })
            })
            return ({ id, position, type: 'turbo', data: flow, selectable: inEdit })
        });
        setInitialEdges(edges);
        setInitialNodes(nodes);
        graphRef.current.resetAllElements(nodes, edges);
    }, [flows]);

    useEffect(() => {
        graphRef.current.setNodes(n => ({ ...n, selectable: inEdit, selected: false }))
        graphRef.current.setEdges(e => ({ ...e, deletable: inEdit, selected: false }))
    }, [inEdit]);

    return <FlowGrapContext.Provider value={{ inEdit, clickOnSetting }}>
        <div className="h-full w-full relative">
            {inEdit && <div className="absolute z-20 top-std-sm left-[22px] bottom-[150px] rounded-std bg-opacity-60 bg-deep-strong " >
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
                />
            </div>}
            <Graph
                initialEdges={initialEdges}
                initialNodes={initialNodes}
                className="rounded-std bg-deep"
                nodeTypes={{ turbo: TurboNode }}
                edgeTypes={{ turbo: TurboEdge }}
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
                    const id = v4();
                    graphRef.current?.addNode({ id, position, data: { ...onDragItem, id, position, forwards: [] }, type: 'turbo' });
                    setOnDragItem(() => undefined);
                }}
                {...others}
            >
                <TurboEdgeAsset />
            </Graph>
            <Modal
                title="Set the promt"
                onOk={onOk}
                onCancel={onCancel}
                visible={openModal?.type === 'prompt'}
            >
                <Form defaultValues={openModal} onLoad={form => setForm(form)}>{
                    (Item) =>
                        <>
                            <Item name='name' label="Name" >
                                <InputText />
                            </Item>
                            <Item name='promt' label="Promt" >
                                <InputTextarea className="w-full min-h-[100px]" />
                            </Item>
                        </>
                }</Form>
            </Modal>
        </div>

    </FlowGrapContext.Provider>
}
