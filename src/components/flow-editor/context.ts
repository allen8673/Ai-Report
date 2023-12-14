import { MutableRefObject, useContext } from "react";
import React from "react";

import { GraphInstance } from "@/components/graph/graph";
import { IFlowNode } from "@/interface/workflow";


export type FlowNameMapper = { [id: string]: string }
export interface FlowGraphStore {
    graphRef?: MutableRefObject<GraphInstance<IFlowNode, any> | null>;
    inEdit?: boolean;
    clickOnSetting?: (flow: IFlowNode) => void;
    flowNameMapper: FlowNameMapper
}

export const FlowGrapContext = React.createContext<FlowGraphStore>({
    flowNameMapper: {}
});

export const useFlowGrapContext = (): FlowGraphStore => useContext(FlowGrapContext);
