'use client'

import _ from "lodash";
import { useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import ReactFlow, {
    Node,
    Edge,
    Connection,
    MiniMap,
    Controls,
    Background,
    NodeChange,
    applyNodeChanges,
    ReactFlowInstance,
    EdgeChange,
    applyEdgeChanges,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { v4 } from "uuid";

import { EventType, GraphInstance, GraphProps } from "./graph";



export default function Graph<NData, EData, NNormal = NData, ENormal = EData>(props: GraphProps<NData, EData, NNormal, ENormal>) {

    const {
        className,
        initialNodes,
        initialEdges,
        readonly,
        hideMiniMap,
        graphRef,
        edgeEditable,
        normalizeNode,
        normalizeEdge,
        onLoad,
        onNodesSelected,
        onEdgesSelected,
        onNodesChange,
        onEdgesChange,
        onDrop,
        onMouseUp,
        onMouseDown,
        onNodeMouseMove,
        onReadonly,
        onDiagramsContextMenu,
        onNodeContextMenu,
        onEdgeContextMenu,
        children,
        ...others } = props;

    const rfWrapper = useRef<HTMLDivElement>(null);
    const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance>();
    const [ondrag, setOndrag] = useState<boolean>();
    const [nodes, setNodes] = useState<Node<NData>[]>([]);
    const [edges, setEdges] = useState<Edge<EData>[]>([]);

    useEffect(() => {
        setNodes(initialNodes || []);
        setEdges(initialEdges || []);
    }, []);

    useEffect(() => {
        _setNodes(
            _.map<Node<NData>, NodeChange>(nodes, (n) => ({
                type: 'reset',
                item: { ...n, draggable: n.draggable && !readonly },
            })),
            ''
        );
    }, [readonly]);

    /**
     * Announce exposed functionalities by treeRef
     */
    useImperativeHandle<GraphInstance<NData, EData>, GraphInstance<NData, EData>>(graphRef, () => ({
        addNode: (node: Node<NData>): void => {
            _setNodes([{ type: 'add', item: node }], 'change');
        },
        setNode: (nodeId: string, data: ((oldNode: Node<NData>) => Node<NData>) | Node<NData>): void => {
            _setNodes(
                _.map<Node<NData>, NodeChange>(nodes, (n) => {
                    if (n.id === nodeId) {
                        if (typeof data === 'function') {
                            return { type: 'reset', item: data(_.cloneDeep(n)) };
                        } else {
                            return { type: 'reset', item: data };
                        }
                    }
                    return {
                        type: 'reset',
                        item: n,
                    };
                }),
                'change'
            );
        },
        setNodes: (data: ((oldNode: Node<NData>) => Node<NData>) | Node<NData>): void => {
            _setNodes(
                _.map<Node<NData>, NodeChange>(nodes, (n) => {
                    if (typeof data === 'function') {
                        return { type: 'reset', item: data(_.cloneDeep(n)) };
                    } else {
                        return { type: 'reset', item: data };
                    }
                }),
                'change'
            );
        },
        getNodes: (): Node<NData>[] => {
            return nodes
        },
        removeNode: (nodeId: string): void => {
            const connectEdge = _.filter(edges, (e) => e.source === nodeId || e.target === nodeId);
            _setNodes([{ type: 'remove', id: nodeId }], 'change');
            _setEdges(_.map(connectEdge, (e) => ({ type: 'remove', id: e.id })));
        },
        duplicateNode: (nodeId: string, setNewNode?: (node: Node<NData>) => Node<NData>): void => {
            const node = _.find(nodes, ['id', nodeId]);
            if (!node) return;

            const newNodeId = v4();
            const x = (node as Node<NData>)?.position?.x || 0;
            const y = (node as Node<NData>)?.position?.y || 0;

            const newNode: Node<NData> = {
                ...node,
                id: newNodeId,
                position: {
                    x: x + 50,
                    y: y + 50,
                },
            };

            _setNodes([{ type: 'add', item: !!setNewNode ? setNewNode(newNode) : newNode }], 'change');
        },
        addEdge: (edge: Edge<EData>): void => {
            _setEdges([{ type: 'add', item: edge }]);
        },
        setEdge: (edgeId: string, data: ((oldNode: Edge<EData>) => Edge<EData>) | Edge<EData>): void => {
            _setEdges(
                _.map<Edge<EData>, EdgeChange>(edges, (e) => {
                    if (e.id === edgeId) {
                        if (typeof data === 'function') {
                            return { type: 'reset', item: data(_.cloneDeep(e)) };
                        } else {
                            return { type: 'reset', item: data };
                        }
                    }
                    return {
                        type: 'reset',
                        item: e,
                    };
                })
            );
        },
        setEdges: (data: ((oldNode: Edge<EData>) => Edge<EData>) | Edge<EData>): void => {
            _setEdges(
                _.map<Edge<EData>, EdgeChange>(edges, (e) => {
                    if (typeof data === 'function') {
                        return { type: 'reset', item: data(_.cloneDeep(e)) };
                    } else {
                        return { type: 'reset', item: data };
                    }
                })
            );
        },
        removeEdge: (edgeId: string): void => {
            _setEdges([{ type: 'remove', id: edgeId }]);
        },
        resetAllElements: (_nodes?: Node<NData>[], _edges?: Edge<EData>[]): void => {
            setNodes(() => (_nodes || initialNodes || []));
            setEdges(() => _edges || initialEdges || []);
        },
        reactFlowInstance,
    }));

    const _onInit = useCallback(
        (rfi: any) => {
            if (!reactFlowInstance) {
                setReactFlowInstance(rfi);
            }
            onLoad?.(rfi);
        },
        [reactFlowInstance]
    );

    const debounceOnNodesChange = useMemo(() => {
        return _.debounce((changes: NodeChange[], newNodes: Node<NData>[]) => {
            onNodesChange?.(changes, newNodes);
        }, 300);
    }, [onNodesChange]);

    const debounceonEdgesChange = useMemo(() => {
        return _.debounce((newEdges: Edge<EData>[]) => {
            onEdgesChange?.(newEdges);
        }, 300);
    }, [onEdgesChange]);

    const _setNodes = useMemo(
        () =>
            (changes: NodeChange[], eventType: EventType): void => {
                if (!!readonly && !!eventType) {
                    onReadonly?.(eventType);
                }
                setNodes((ns) => {
                    const newNodes = applyNodeChanges(changes, ns);

                    if (_.isEqual(ns, newNodes)) {
                        return ns;
                    } else {
                        debounceOnNodesChange(changes, newNodes);
                        return newNodes;
                    }
                });
            },
        [, readonly]
    );

    const _setEdges = (changes: EdgeChange[], edges?: Edge<EData>[]): void => {
        setEdges((es) => {
            const newEdges = !_.isEmpty(changes) ? applyEdgeChanges(changes, es) : edges || es;
            if (_.isEqual(es, newEdges)) return es;
            debounceonEdgesChange(newEdges);
            return newEdges;
        });
    };

    const _onSelectionChange = useCallback(({ nodes: _n, edges: _e }: { nodes: Node<NNormal>[]; edges: Edge<ENormal>[] }): void => {
        onNodesSelected?.(_n);
        onEdgesSelected?.(_e);
    }, []);

    const _onEdgeUpdate = useCallback((oldEdge: Edge<EData>, newConnection: Connection) => {
        const { source, target, ...handles } = newConnection;
        if (!source || !target) return;

        _setEdges(
            _.map<Edge<EData>, EdgeChange>(edges, (e) => {
                if (e.id === oldEdge.id) {
                    return {
                        type: 'reset',
                        item: { ...oldEdge, ...handles, source, target },
                    };
                }
                return {
                    type: 'reset',
                    item: e,
                };
            })
        );
    }, []);

    const _onNodesChange = useCallback((changes: NodeChange[]): void => {
        _setNodes(changes, _.some(changes, (c: NodeChange) => _.includes(['add', 'remove', 'reset'], c.type)) ? 'change' : '');
    }, [, readonly]);

    const _onEdgesChange = useCallback((changes: EdgeChange[]) => {
        _setEdges(changes);
    }, []);

    const _onElementsDragOver = (event: React.DragEvent<HTMLDivElement>): void => {
        event.stopPropagation();
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    };

    const _onMouseUp = (event: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
        if (readonly) {
            setOndrag(() => false);
        }

        if (!rfWrapper?.current || !onMouseUp) return;
        const reactFlowBounds = rfWrapper?.current.getBoundingClientRect();

        const position = reactFlowInstance?.project({
            x: event.clientX - reactFlowBounds.left,
            y: event.clientY - reactFlowBounds.top,
        });

        onMouseUp(event, position);
    };

    const _onMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
        if (readonly) {
            setOndrag(() => true);
        }

        if (!rfWrapper?.current || !onMouseDown) return;
        const reactFlowBounds = rfWrapper?.current.getBoundingClientRect();

        const position = reactFlowInstance?.project({
            x: event.clientX - reactFlowBounds.left,
            y: event.clientY - reactFlowBounds.top,
        });

        onMouseDown(event, position);
    };

    const _onElementsDrop = (event: React.DragEvent<HTMLDivElement>): void => {
        event.stopPropagation();
        event.preventDefault();

        if (!rfWrapper?.current || !onDrop) return;
        const reactFlowBounds = rfWrapper?.current.getBoundingClientRect();
        const type = event.dataTransfer.getData('application/type');
        let payload = event.dataTransfer.getData('application/payload');
        try {
            payload = JSON.parse(payload);
        } catch (e) {
            //
        }
        const position = reactFlowInstance?.project({
            x: event.clientX - reactFlowBounds.left,
            y: event.clientY - reactFlowBounds.top,
        });

        onDrop(type, position, payload);
    };

    const _onNodeMouseMove = (event: React.MouseEvent, node: Node<NData>): void => {
        onNodeMouseMove?.(event, node);
        const viewport = reactFlowInstance?.toObject().viewport;
        if (!ondrag || !viewport) return;
        reactFlowInstance?.setViewport({
            zoom: viewport.zoom,
            x: viewport.x + event.movementX,
            y: viewport.y + event.movementY,
        });
    };

    return <div id='graph' className={`w-full h-full std-content ${className}`} ref={rfWrapper}>
        <ReactFlow
            nodes={!!normalizeNode ? _.map(nodes, (n) => normalizeNode(n)) : nodes}
            edges={!!normalizeEdge ? _.map(edges, (e) => normalizeEdge(e)) : edges}
            minZoom={0.1}
            onInit={_onInit}
            onEdgeUpdate={!readonly && edgeEditable ? _onEdgeUpdate : undefined}
            onNodesChange={_onNodesChange}
            onEdgesChange={_onEdgesChange}
            onSelectionChange={_onSelectionChange}
            onDragOver={_onElementsDragOver}
            onDrop={_onElementsDrop}
            onMouseDown={_onMouseDown}
            onMouseUp={_onMouseUp}
            snapToGrid={true}
            snapGrid={[10, 10]}
            onNodeContextMenu={(e, node): void => {
                onDiagramsContextMenu?.(e, node as Node<NNormal>);
                onNodeContextMenu?.(e, node);
            }}
            onEdgeContextMenu={(e, edge): void => {
                onDiagramsContextMenu?.(e, edge as Edge<ENormal>);
                onEdgeContextMenu?.(e, edge);
            }}
            onNodeMouseMove={_onNodeMouseMove}
            nodesDraggable={!readonly}
            {...others}
        >
            {children}
            {!hideMiniMap && <MiniMap nodeBorderRadius={2} />}
            <Controls />
            <Background gap={16} />
        </ReactFlow>
    </div>
}
