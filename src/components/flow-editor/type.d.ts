import { GraphProps } from "@/components/graph/graph";
import { IFlowNode, ICustomCompData, ComponentOpt, SysPromptOpt } from "@/interface/flow";

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
    customComps?: ICustomCompData[];
    sysPromptOpts?: SysPromptOpt[];
    onAddComponent?: (comp: ICustomCompData) => void;
    onEditComponent?: (comp: ICustomCompData) => void;
    onDeleteComponent?: (comp: ICustomCompData) => void;
}

export type FlowNameMapper = { [id: string]: string }

