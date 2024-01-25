import { IFlowBase } from "@/interface/flow";

export interface FlowListProps {
    flows: IFlowBase[];
    defaultSelectedItem?: IFlowBase;
    onAddWF?: () => void;
    onItemSelected?: (item: IFlowBase) => void
}

export interface ListItemProps {
    key: string;
    item: IFlowBase;
}