import { MenuItem } from "primereact/menuitem";
import { Dispatch, SetStateAction, useContext } from "react";
import React from "react";

import { IFlowBase } from "@/interface/flow";

export interface FlowListStore {
    selectedFlow?: IFlowBase;
    setSelectedFlow: Dispatch<SetStateAction<IFlowBase | undefined>>;
    renderMenus?: (item: IFlowBase) => MenuItem[];
}

export const FlowListContext = React.createContext<FlowListStore>({
    setSelectedFlow: () => { }
});

export const useFlowListContext = (): FlowListStore => useContext(FlowListContext);
