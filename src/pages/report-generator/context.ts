import { MutableRefObject, useContext } from "react";
import React from "react";
import { Node, Edge } from 'reactflow'

import { IReportItem } from "./type";

import { GraphInstance } from "@/components/graph/graph";

export interface GeneratorStore {
    diagramRef?: MutableRefObject<GraphInstance<IReportItem, any> | null>;
    activeNode?: Node<IReportItem>;
    activeEdge?: Edge;
    onDragItem?: IReportItem;
}

export const GeneratorContext = React.createContext<GeneratorStore>({
    // 
});

export const useGeneratorContext = (): GeneratorStore => useContext(GeneratorContext);
