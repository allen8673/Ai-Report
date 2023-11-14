import _ from "lodash";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { useEffect, useState } from "react";
import { Connection, Edge, Node } from 'reactflow'

import Form from "../form";
import { FormInstance } from "../form/form";
import Graph from "../graph";
import { GraphProps } from "../graph/graph";
import { useGraphRef } from "../graph/helper";
import Modal from "../modal";

import TurboEdge, { TurboEdgeAsset } from "./assets/turbo-edge";
import TurboNode from "./assets/turbo-node";
import { EDGE_DEF_SETTING } from "./configuration";
import { FlowGrapContext } from "./context";

import { IFlow } from "@/interface/workflow";

import './assets/turbo-style.css';

interface FlowGraphProps extends Omit<GraphProps<IFlow>,
    'initialNodes' |
    'initialEdges' |
    'nodeTypes' |
    'edgeTypes' |
    'defaultEdgeOptions' |
    'onConnect' |
    'readonly'> {
    flows: IFlow[];
    inEdit?: boolean;
}

export default function FlowGraph({ flows, inEdit, graphRef: ref, ...others }: FlowGraphProps) {

    const [initialEdges, setInitialEdges] = useState<Edge<any>[]>([]);
    const [initialNodes, setInitialNodes] = useState<Node<IFlow>[]>([]);
    const [form, setForm] = useState<FormInstance<IFlow>>()
    const { graphRef } = useGraphRef<IFlow, any>(ref);
    const [openModal, setOpenModal] = useState<IFlow>()

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
                edges.push({ id: `${flow.id}-${fw}`, source: flow.id, target: fw })
            })
            return ({ id, position, type: 'turbo', data: flow, })
        });
        setInitialEdges(edges);
        setInitialNodes(nodes);
        graphRef.current.resetAllElements(nodes, edges);
    }, [flows]);

    return <FlowGrapContext.Provider value={{ inEdit, clickOnSetting }}>
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
    </FlowGrapContext.Provider>
}

