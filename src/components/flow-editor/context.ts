import { MutableRefObject, useContext } from "react";
import React from "react";

import { GraphInstance } from "@/components/graph/graph";
import { IFlow } from "@/interface/workflow";


export type ITemplateMap = { [id: string]: string }
export interface FlowGraphStore {
    graphRef?: MutableRefObject<GraphInstance<IFlow, any> | null>;
    inEdit?: boolean;
    clickOnSetting?: (flow: IFlow) => void;
    templateMap: ITemplateMap
}

export const FlowGrapContext = React.createContext<FlowGraphStore>({
    templateMap: {}
});

export const useFlowGrapContext = (): FlowGraphStore => useContext(FlowGrapContext);
