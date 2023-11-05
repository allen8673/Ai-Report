'use client'

import { useCallback, useRef } from "react";
import ReactFlow, {
    Node,
    Edge,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    ConnectionLineType,
    MiniMap,
    Controls,
    Background
} from 'reactflow';
import 'reactflow/dist/style.css';

export interface IGrapth<NData, EData> {
    className?: string
    initialNodes?: Node<NData>[];
    initialEdges?: Edge<EData>[];
    hideMiniMap?: boolean;

}

export default function Grapth<NData, EData>(props: IGrapth<NData, EData>) {

    const { className, initialNodes, initialEdges, hideMiniMap } = props;

    const rfWrapper = useRef<HTMLDivElement>(null);
    const [nodes, setNodes, onNodesChange] = useNodesState<NData>(initialNodes || []);
    const [edges, setEdges, onEdgesChange] = useEdgesState<EData>(initialEdges || []);

    const onConnect = useCallback(
        (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    return <div className={`w-96 h-96 bg-slate-50 ${className}`} ref={rfWrapper}>
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            defaultEdgeOptions={{
                animated: true,
                type: 'smoothstep',
            }}
            connectionLineType={ConnectionLineType.SmoothStep}
            fitView
        >
            {!hideMiniMap && <MiniMap nodeBorderRadius={2} />}
            <Controls />
            <Background color="#aaa" gap={16} />
        </ReactFlow>
    </div>
}
