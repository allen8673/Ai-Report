import { filter, find, includes, max, some } from "lodash";
import { v4 } from "uuid";

import { IFlowNode } from "@/interface/workflow";

export const calculateDepth = (nodes: IFlowNode[], fullFlows: IFlowNode[], deep = 0): void => {
    nodes.forEach(node => {
        const forwars_nodes = filter(fullFlows, n => includes(node.forwards, n.id));
        calculateDepth(forwars_nodes, fullFlows, deep + 1);
        node.depth = max([node.depth || 0, deep]);
    });
}

export const X_GAP = 400, Y_GAP = 150;
export const resetPosition_x = (nodes: IFlowNode[], resetIds: string[], setX = 0) => {
    for (const id of resetIds) {
        const node = find(nodes, ['id', id]);
        if (!node) continue;
        node.position.x = max([node.position.x, setX]) || node.position.x;
        resetPosition_x(nodes, node.forwards, setX + X_GAP)
    }
}
export const resetPosition_y = (nodes: IFlowNode[], resetIds: string[], setY = 0) => {
    for (const id of resetIds) {
        const node = find(nodes, ['id', id]);
        if (!node) continue;
        while (some(nodes.filter(n => n !== node),
            n => n.position.x === node.position.x && n.position.y === setY)
        ) {
            setY += Y_GAP
        }
        node.position.y = setY;
        resetPosition_y(nodes, node.forwards)
    }
}

/**
 * assign new ids to nodes
 * @param nodes 
 * @returns 
 */
export const getNewIdTrans = (nodes: IFlowNode[]): Record<string, string> => {
    return nodes.reduce<Record<string, string>>((result, cur) => {
        result[cur.id] = `tmp_${v4()}`;
        return result
    }, {});
}
