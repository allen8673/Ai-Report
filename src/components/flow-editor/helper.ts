import { filter, includes, max, mergeWith, min } from "lodash";
import { XYPosition } from "reactflow";

import { IFlow } from "@/interface/workflow";

export const calculateDepth = (nodes: IFlow[], fullFlows: IFlow[], deep = 0): void => {
    nodes.forEach(node => {
        const forwars_nodes = filter(fullFlows, n => includes(node.forwards, n.id));
        calculateDepth(forwars_nodes, fullFlows, deep + 1);
        node.depth = max([node.depth || 0, deep]);
    });
}

export const X_GAP = 430, Y_GAP = 150;
export const getNewPosition = (nodes: IFlow[], flows: IFlow[] = [], x = 0, y = 0): Record<string, XYPosition> => {
    return nodes
        .sort((a, b) => (a.position.y < b.position.y ? -1 : 1))
        .reduce<Record<string, XYPosition>>((result, node) => {
            const forwars_nodes = filter(flows, n => includes(node.forwards, n.id))
            const merge = mergeWith(
                result,
                getNewPosition(forwars_nodes, flows, x + X_GAP, y),
                (obj, src) => {
                    return { x: max([(obj || src).x, src.x || 0]), y: min([(obj || src).y, src.y]) }
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
