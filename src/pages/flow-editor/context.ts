import { MutableRefObject, useContext } from "react";
import React from "react";
import { Node, Edge } from 'reactflow'


import { GraphInstance } from "@/components/graph/graph";
import { IFlow } from "@/interface/project";

export interface GeneratorStore {
    diagramRef?: MutableRefObject<GraphInstance<IFlow, any> | null>;
    activeNode?: Node<IFlow>;
    activeEdge?: Edge;
    onDragItem?: IFlow;
}

export const GeneratorContext = React.createContext<GeneratorStore>({
    // 
});

export const useGeneratorContext = (): GeneratorStore => useContext(GeneratorContext);
