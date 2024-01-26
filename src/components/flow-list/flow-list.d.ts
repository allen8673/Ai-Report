import { MenuItem } from "primereact/menuitem";

import { IFlowBase } from "@/interface/flow";
export interface FlowListProps {
    flows: IFlowBase[];
    defaultSelectedItem?: IFlowBase;
    onAddWF?: () => void;
    onItemSelected?: (item: IFlowBase) => void;
    renderMenus?: (item: IFlowBase) => MenuItem[];
}

export interface ListItemProps {
    key: string;
    item: IFlowBase;
}