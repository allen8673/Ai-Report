import { useContext } from "react";
import React from "react";

import { IWorkflow } from "@/interface/workflow";



export interface WfLayoutStore {
    runWorkflow: (wf?: IWorkflow | string) => void;
    viewReports: (workflowId: string) => void;
}

export const WfLayoutContext = React.createContext<WfLayoutStore>({
    runWorkflow: () => { },
    viewReports: () => { }
});

export const useWfLayoutContext = (): WfLayoutStore => useContext(WfLayoutContext);
