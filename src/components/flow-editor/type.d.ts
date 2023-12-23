import { GraphProps } from "@/components/graph/graph";
import { IFlowNode, IReportModule } from "@/interface/flow";
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
    delayRender?: number;
    componentData?: ComponentData[];
    modules?: IReportModule[];
    onAddModule?: (module: IReportModule) => void;
    onEditModule?: (module: IReportModule) => void;
    onDeleteModule?: (module: IReportModule) => void;
}

export type FlowNameMapper = { [id: string]: string }

