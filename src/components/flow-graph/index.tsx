import _ from "lodash";
import { Connection, Edge, Node } from 'reactflow'

import Graph from "../graph";
import { GraphProps } from "../graph/graph";

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
    onConnect?: (data: Connection & { newEdge: Edge }) => void
}

export default function FlowGraph({ flows, inEdit, onConnect, ...others }: FlowGraphProps) {
    const edges: Edge[] = []
    const nodes = _.map<IFlow, Node<IFlow>>(flows, flow => {
        const { id, position, forwards } = flow;
        _.forEach(forwards, fw => {
            edges.push({ id: `${flow.id}-${fw}`, source: flow.id, target: fw })
        })
        return ({ id, position, type: 'turbo', data: flow, })
    });
    return <FlowGrapContext.Provider value={{ inEdit }}>
        <Graph
            className="rounded-std bg-deep"
            initialNodes={nodes}
            initialEdges={edges}
            nodeTypes={{ turbo: TurboNode }}
            edgeTypes={{ turbo: TurboEdge }}
            defaultEdgeOptions={EDGE_DEF_SETTING}
            readonly={!inEdit}
            onConnect={(connection: Connection) => {
                const { source, target } = connection
                if (!source || !target) return;
                const id = `${source}=${target}`
                onConnect?.({ ...connection, newEdge: { id, source, target, ...EDGE_DEF_SETTING } })

            }}
            {...others}
        >
            <TurboEdgeAsset />
        </Graph>
    </FlowGrapContext.Provider>
}