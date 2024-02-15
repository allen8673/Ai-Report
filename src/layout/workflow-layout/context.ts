import { useContext } from "react";
import React from "react";

import { IFlow } from "@/interface/flow";

export interface WfLayoutStore {
    runWorkflow: (wf?: IFlow | string, callback?: (jobId: string) => void) => void;
    viewReports: (workflowId: string) => void;
    workflow?: IFlow;
    fetchingWorkflow?: boolean;
    fetchWorkflow: (callback: () => (IFlow | undefined) | Promise<IFlow | undefined>) => void;
}

export const WfLayoutContext = React.createContext<WfLayoutStore>({
    runWorkflow: () => { },
    viewReports: () => { },
    fetchWorkflow: () => { },
});

export const useWfLayoutContext = (): WfLayoutStore => useContext(WfLayoutContext);
