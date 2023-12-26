import { Dispatch, MutableRefObject, SetStateAction, useContext } from "react";
import React from "react";

import { GraphInstance } from "../graph/graph";

import { FlowGraphProps } from "./type";

// import { GraphInstance } from "@/components/graph/graph";
import { IFlowNode } from "@/interface/flow";
// import { ComponentData } from "@/interface/master";


export interface FlowGraphStore extends Omit<FlowGraphProps, 'graphRef'> {
    graphRef?: MutableRefObject<GraphInstance<IFlowNode, any> | null>;
    clickOnSetting?: (flow: IFlowNode) => void;
    selectedGroup?: string;
    setSelectedGroup: Dispatch<SetStateAction<string | undefined>>;
}

export const FlowGrapContext = React.createContext<FlowGraphStore>({
    flows: [],
    setSelectedGroup: () => { }
});

export const useFlowGrapContext = (): FlowGraphStore => useContext(FlowGrapContext);
