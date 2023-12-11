import { useContext } from "react";
import React from "react";

import { IWorkflow } from "@/interface/workflow";



export interface WfLayoutStore {
    runWorkflow: (wf: IWorkflow | string | undefined) => void
}

export const WfLayoutContext = React.createContext<WfLayoutStore>({
    runWorkflow: () => { }
});

export const useWfLayoutContext = (): WfLayoutStore => useContext(WfLayoutContext);
