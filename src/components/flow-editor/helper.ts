import { cloneDeep, filter, find, includes, max, remove, some } from "lodash";
import { v4 } from "uuid";

import { IFlow, IFlowNode } from "@/interface/flow";

/**
 * calculate the depth of node in flow
 * @param nodes 
 * @param fullFlows 
 * @param deep 
 */
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
        const cal_x = Math.floor(node.position.x / X_GAP) * X_GAP;
        node.position.x = max([cal_x, setX]) || node.position.x;
        // node.position.x = setX || node.position.x;
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

/**
 * check all nodes of flow are connected
 * @param nodes 
 * @returns 
 */
export const ifFlowIsCompleted = (nodes: IFlowNode[] = []): boolean => {
    for (const node of nodes) {
        if (node.type === 'Output') {
            if (!some(nodes, n => includes(n.forwards, node.id))) return false
        } else {
            if (!node.forwards?.length) return false;
        }
    }
    return true
}

interface ExpandRefWF {
    nodes: IFlowNode[];
    workflowSource: (ref_wf: IFlowNode) => (IFlow | undefined) | Promise<(IFlow | undefined)>
}

export const expandRefWF = async ({ nodes, workflowSource }: ExpandRefWF) => {
    const _nodes = cloneDeep(nodes || []);
    /**
     * get all reference nodes from input nodes
     */
    const ref_wfs = filter(_nodes, n => n.type === 'Workflow')

    /**
     * get all workflows by reference nodes,
     * and use the workflows instead of all reference nodes. 
     */
    for (const ref_wf of ref_wfs) {
        const wf = await workflowSource(ref_wf)
        if (!wf) continue;

        /**
         * first, expand the reference nodes in the workflow
         */
        const wf_flows = await expandRefWF({ nodes: wf.flows, workflowSource });


        /**
         * get the workflow start node and end node.
         * and remove the starrt node and end node from the flows of workflow
         */
        let wf_start: IFlowNode | undefined, wf_end: IFlowNode | undefined

        const wf_flows_result = wf_flows.reduce<IFlowNode[]>((pre, flow) => {
            if (!includes(['Input', 'Output'], flow.type)) {
                pre.push(flow)
                return pre;
            }

            if (flow.type === 'Input') wf_start = flow;
            if (flow.type === 'Output') wf_end = flow;
            return pre;
        }, [])

        // for (const flow of wf_flows) {
        //     if (!includes(['Input', 'Output'], flow.type)) continue;
        //     if (flow.type === 'Input') wf_start = flow;
        //     if (flow.type === 'Output') wf_end = flow;
        //     remove(wf_flows, flow)
        // }

        /**
         * get all source nodes of reference node,
         * and put all of forwards of workflow start node to all forwards of source nodes,
         * to instead of reference node.
         */
        const sources = filter(_nodes, n => includes(n.forwards, ref_wf.id));
        for (const src of sources) {
            if (!src.forwards) continue;
            remove(src.forwards, ref_wf.id);
            src.forwards.push(...(wf_start?.forwards || []))
        }

        /**
         * get all source nodes of workflow end node.
         * also, put all of forwards of reference nodes to the forwards of workflow end node,
         * to instead of reference node.
         */
        const wf_end_sources = filter(wf_flows_result, n => includes(n.forwards, wf_end?.id || ''));
        for (const wf_end_src of wf_end_sources) {
            wf_end_src.forwards = ref_wf.forwards
        }

        /**
         * at the end, push the workflow to the node instead of reference node
         */
        _nodes.push(...wf_flows_result)
        remove(_nodes, ['id', ref_wf.id]);
    }

    /**
     * have to trans the node id before return
     */
    const id_trans: Record<string, string> = getNewIdTrans(_nodes);
    return _nodes.reduce<IFlowNode[]>((result, cur) => {
        result.push({
            ...cur,
            id: (id_trans[cur.id] || ''),
            forwards: (cur.forwards?.map(f => id_trans[f] || '').filter(i => !!i)) || [],
        })
        return result;
    }, []);

}
