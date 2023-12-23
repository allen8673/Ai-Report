import { MutableRefObject, useContext } from "react";
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
}

export const FlowGrapContext = React.createContext<FlowGraphStore>({
});

export const useFlowGrapContext = (): FlowGraphStore => useContext(FlowGrapContext);
