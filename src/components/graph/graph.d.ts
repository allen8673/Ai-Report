import { Node, Edge, ReactFlowInstance, ReactFlowProps, NodeChange, XYPosition } from 'reactflow';

export type AddEdge = Edge | Connection;
export type EventType = 'drop' | 'change' | '';
export interface GraphProps<NData, EData = any, NNormal = NData, ENormal = EData> extends Omit<ReactFlowProps,
    | 'nodes'
    | 'edges'
    | 'defaultNodes'
    | 'defaultEdges'
    | 'minZoom'
    | 'onLoad'
    | 'onInit'
    | 'onEdgeUpdate'
    | 'onNodesChange'
    | 'onEdgesChange'
    | 'onSelectionChange'
    | 'onDragOver'
    | 'onDrop'
    | 'onMouseUp'
    | 'onMouseDown'
    | 'onContextMenu'
    | 'nodesDraggable'
> {
    className?: string
    initialNodes?: Node<NData>[];
    initialEdges?: Edge<EData>[];
    readonly?: boolean;
    hideMiniMap?: boolean;
    graphRef?: React.Ref<GraphInstance<NData, EData>>;
    edgeEditable?: boolean;
    onLoad?: (rfi?: ReactFlowInstance) => void;
    normalizeNode?: (node: Node<NData>) => Node<NNormal>;
    normalizeEdge?: (edge: Edge<EData>) => Edge<ENormal>;
    onNodesSelected?: (nodes: Node<NNormal>[]) => void;
    onEdgesSelected?: (edges: Edge<ENormal>[]) => void;
    onNodesChange?: (changes: NodeChange[], result: Node<NData>[]) => void;
    onEdgesChange?: (result: Edge<EData>[]) => void;
    onDrop?: (type: string, position: XYPosition | undefined, payload?: any) => void;
    onMouseUp?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>, position: XYPosition | undefined) => void;
    onMouseDown?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>, position: XYPosition | undefined) => void;
    onReadonly?: (eventType: EventType) => void;
    onDiagramsContextMenu?: (event: React.MouseEvent<Element, MouseEvent>, elem?: Node<NNormal> | Edge<ENormal>) => void;
}

/**
 * Interface of tree instance that include the exposed funcionalities
 * @param addNode add node
 * @param removeNode remove node by ids
 * @param addEdge add edge
 * @param removeNode remove edge by id
 * @param resetAllElements reset all elements include all nodes and edges
 */
export interface GraphInstance<NData, EData = any> {
    addNode: (node: Node<NData>) => void;
    setNode: (nodeId: string, data: ((oldNode: Node<NData>) => Node<NData>) | Node<NData>) => void;
    setNodes: (data: ((oldNode: Node<NData>) => Node<NData>) | Node<NData>) => void;
    getNodes: () => Node<NData>[];
    removeNode: (nodeId: string) => void;
    duplicateNode: (nodeId: string, setNewNode?: (node: Node<NData>) => Node<NData>) => void;
    addEdge: (edge: Edge<EData>) => void;
    setEdge: (edgeId: string, data: ((oldEdge: Edge<EData>) => Edge<EData>) | Edge<EData>) => void;
    setEdges: (data: ((oldEdge: Edge<EData>) => Edge<EData>) | Edge<EData>) => void;
    removeEdge: (edgeId: string) => void;
    resetAllElements: (nodes?: Node<NData>[], edges?: Edge<EData>[]) => void;
    reactFlowInstance?: ReactFlowInstance;
}