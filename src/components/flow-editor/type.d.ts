import React from "react";

import { GraphProps } from "@/components/graph/graph";
import { IFlowNode } from "@/interface/flow";

export interface FlowGraphProps extends Omit<GraphProps<IFlowNode>,
    'initialNodes' |
    'initialEdges' |
    'nodeTypes' |
    'edgeTypes' |
    'defaultEdgeOptions' |
    'onConnect' |
    'onEdgesDelete' |
    'readonly'> {
    flows: IFlowNode[];
    inEdit?: boolean;
    flowNameMapper?: FlowNameMapper;
    delayRender?: number;
    actionBarContent?: React.ReactElement | ((graphProps: FlowGraphProps, actbar: React.ReactElement) => React.ReactElement);
    actionBarClass?: string;
    showActionBar?: boolean;
}

export type FlowNameMapper = { [id: string]: string }

