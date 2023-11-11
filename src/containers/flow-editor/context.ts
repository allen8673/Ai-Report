import { MutableRefObject, useContext } from "react";
import React from "react";
import { Node, Edge } from 'reactflow'

import { GraphInstance } from "@/components/graph/graph";
import { IFlow, IFlowBase } from "@/interface/workflow";

export interface GeneratorStore {
    diagramRef?: MutableRefObject<GraphInstance<IFlow, any> | null>;
    activeNode?: Node<IFlow>;
    activeEdge?: Edge;
    onDragItem?: IFlowBase;
}

export const GeneratorContext = React.createContext<GeneratorStore>({
    // 
});

export const useGeneratorContext = (): GeneratorStore => useContext(GeneratorContext);
