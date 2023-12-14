import { useContext } from "react";
import React from "react";

import { IFlow } from "@/interface/flow";



export interface WfLayoutStore {
    runWorkflow: (wf?: IFlow | string) => void;
    viewReports: (workflowId: string) => void;
}

export const WfLayoutContext = React.createContext<WfLayoutStore>({
    runWorkflow: () => { },
    viewReports: () => { }
});

export const useWfLayoutContext = (): WfLayoutStore => useContext(WfLayoutContext);
