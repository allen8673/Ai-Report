import { GraphProps } from "@/components/graph/graph";
import { IFlowNode, IReportCompData, ComponentOpt } from "@/interface/flow";

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
    componentOpts?: ComponentOpt[];
    customComps?: IReportCompData[];
    onAddModule?: (module: IReportCompData) => void;
    onEditModule?: (module: IReportCompData) => void;
    onDeleteModule?: (module: IReportCompData) => void;
}

export type FlowNameMapper = { [id: string]: string }

