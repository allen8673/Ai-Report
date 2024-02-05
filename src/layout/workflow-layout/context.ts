import { Dispatch, SetStateAction, useContext } from "react";
import React from "react";

import { IFlow } from "@/interface/flow";

export interface WfLayoutStore {
    runWorkflow: (wf?: IFlow | string, callback?: (jobId: string) => void) => void;
    viewReports: (workflowId: string) => void;
    cacheWorkflow?: IFlow;
    setCacheWorkflow: Dispatch<SetStateAction<IFlow | undefined>>
}

export const WfLayoutContext = React.createContext<WfLayoutStore>({
    runWorkflow: () => { },
    viewReports: () => { },
    setCacheWorkflow: () => { },
});

export const useWfLayoutContext = (): WfLayoutStore => useContext(WfLayoutContext);
