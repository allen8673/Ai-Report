import { MutableRefObject, useContext } from "react";
import React from "react";

import { GraphInstance } from "@/components/graph/graph";
import { IFlow } from "@/interface/workflow";

export interface FlowGraphStore {
    graphRef?: MutableRefObject<GraphInstance<IFlow, any> | null>;
    inEdit?: boolean;
}

export const FlowGrapContext = React.createContext<FlowGraphStore>({

});

export const useFlowGrapContext = (): FlowGraphStore => useContext(FlowGrapContext);
