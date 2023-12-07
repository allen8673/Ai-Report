import { filter, includes, max, mergeWith, min, values } from "lodash";
import { XYPosition } from "reactflow";
import { v4 } from "uuid";

import { IFlowNode } from "@/interface/workflow";

export const calculateDepth = (nodes: IFlowNode[], fullFlows: IFlowNode[], deep = 0): void => {
    nodes.forEach(node => {
        const forwars_nodes = filter(fullFlows, n => includes(node.forwards, n.id));
        calculateDepth(forwars_nodes, fullFlows, deep + 1);
        node.depth = max([node.depth || 0, deep]);
    });
}

export type NewPositionReturn = Record<string, {
    groupId?: string;
    position: XYPosition
}>
export const X_GAP = 430, Y_GAP = 150;
export const getNewPosition = (nodes: IFlowNode[], flows: IFlowNode[] = [], x = 0, y = 0):
    NewPositionReturn => {

    /**
     * groupId is use to check if the sibling node is in same group
     */
    let groupId: string | undefined;
    return nodes
        .reduce<NewPositionReturn>((result, node) => {
            /**
             * fist,  get the forwar nodes, and calculate the new positions
             */
            const forwars_nodes = filter(flows, n => includes(node.forwards, n.id))
            const newPosition = getNewPosition(forwars_nodes, flows, x + X_GAP, y);

            /**
             * merge the new position of forward nodes and other calculated position
             */
            const merge = mergeWith(
                result,
                newPosition,
                (obj, src) => {
                    return {
                        groupId: (obj || src).groupId,
                        position: {
                            x: max([(obj || src).position.x, src.position.x || 0]),
                            y: min([(obj || src).position.y, src.position.y])
                        }
                    }
                }
            );

            result = {
                ...merge,
                [node.id]: {
                    groupId: node.groupId,
                    position: { x, y }
                }
            }

            /**
             * if the sibling node is in difference group, 
             * then the y-point should start from the last group
             */
            if (groupId !== node.groupId) {
                const groupInfos = values(merge).filter(v => v.groupId === groupId)
                y = (max(groupInfos.map(g => g.position.y)) || 0)
            }

            y += Y_GAP;
            groupId = node?.groupId
            return result;
        }, {})
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
