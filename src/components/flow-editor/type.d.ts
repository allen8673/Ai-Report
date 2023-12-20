import { GraphProps } from "@/components/graph/graph";
import { IFlowNode } from "@/interface/flow";
import { ComponentData } from "@/interface/master";

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
    delayRender?: number
    componentData?: ComponentData[]
}

export type FlowNameMapper = { [id: string]: string }

