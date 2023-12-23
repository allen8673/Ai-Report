import { Dispatch, MutableRefObject, SetStateAction, useContext } from "react";
import React from "react";

import { FlowNameMapper } from "./type";

import { GraphInstance } from "@/components/graph/graph";
import { IFlowNode } from "@/interface/flow";
import { ComponentData } from "@/interface/master";


export interface FlowGraphStore {
    graphRef?: MutableRefObject<GraphInstance<IFlowNode, any> | null>;
    inEdit?: boolean;
    clickOnSetting?: (flow: IFlowNode) => void;
    flowNameMapper?: FlowNameMapper;
    componentData?: ComponentData[];
    selectedGroup?: string
    setSelectedGroup: Dispatch<SetStateAction<string | undefined>>
}

export const FlowGrapContext = React.createContext<FlowGraphStore>({
    setSelectedGroup: () => { }
});

export const useFlowGrapContext = (): FlowGraphStore => useContext(FlowGrapContext);
