import _ from "lodash";
import { useEffect, useState } from "react";
import { Connection, Edge, Node } from 'reactflow'

import Graph from "../graph";
import { GraphProps } from "../graph/graph";
import { useGraphRef } from "../graph/helper";

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
    const { graphRef } = useGraphRef<IFlow, any>(ref)

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

    return <FlowGrapContext.Provider value={{ inEdit }}>
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
    </FlowGrapContext.Provider>
}