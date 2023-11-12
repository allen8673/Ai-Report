import { MutableRefObject, useContext } from "react";
import React from "react";

import { GraphInstance } from "@/components/graph/graph";
import { IFlow, IFlowBase } from "@/interface/workflow";

export interface GeneratorStore {
    diagramRef?: MutableRefObject<GraphInstance<IFlow, any> | null>;
    onDragItem?: IFlowBase;
}

export const GeneratorContext = React.createContext<GeneratorStore>({
    // 
});

export const useGeneratorContext = (): GeneratorStore => useContext(GeneratorContext);
