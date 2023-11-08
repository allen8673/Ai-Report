import { MutableRefObject, useRef } from 'react';

import { GraphInstance } from './graph';


export const useGraphRef = <NData, EData = any>(): { graphRef: MutableRefObject<GraphInstance<NData, EData> | null> } => {
    const graphRef = useRef<GraphInstance<NData, EData>>({
        addNode: (): void => {
            //
        },
        setNode: (): void => {
            //
        },
        setNodes: (): void => {
            //
        },
        removeNode: (): void => {
            //
        },
        duplicateNode: (): void => {
            //
        },
        addEdge: (): void => {
            //
        },
        setEdge: (): void => {
            //
        },
        setEdges: (): void => {
            //
        },
        removeEdge: (): void => {
            //
        },
        resetAllElements: (): void => {
            //
        },
    });
    return { graphRef };
};
