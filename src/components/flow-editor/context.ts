import { Dispatch, MutableRefObject, SetStateAction, useContext } from "react";
import React from "react";

import { GraphInstance } from "../graph/graph";

import { FlowGraphProps } from "./type";

import { ComponentOpt, ICustomCompData, IFlowNode, SysPromptOpt } from "@/interface/flow";


export interface FlowGraphStore extends Omit<FlowGraphProps, 'graphRef'> {
    graphRef?: MutableRefObject<GraphInstance<IFlowNode, any> | null>;
    clickOnSetting?: (flow: IFlowNode) => void;
    selectedGroup?: string;
    setSelectedGroup: Dispatch<SetStateAction<string | undefined>>;
    onAddComponent?: (comp: ICustomCompData) => void;
    onEditComponent?: (comp: ICustomCompData) => void;
    onDeleteComponent?: (comp: ICustomCompData) => void;
    componentOpts?: ComponentOpt[];
    customComps?: ICustomCompData[];
    sysPromptOpts?: SysPromptOpt[];
}

export const FlowGrapContext = React.createContext<FlowGraphStore>({
    flows: [],
    setSelectedGroup: () => { }
});

export const useFlowGrapContext = (): FlowGraphStore => useContext(FlowGrapContext);
