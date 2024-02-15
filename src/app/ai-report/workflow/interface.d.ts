import { SelectItem } from "primereact/selectitem";
import { Dispatch, SetStateAction } from 'react'

import { IFlow, IFlowBase } from "@/interface/flow";


export interface NewWorkflowData {
    id?: string;
    name?: string;
    template?: string
}

export interface NewWorkflowModalProps {
    addNewFlow?: boolean;
    templateOpts: SelectItem[];
    setAddNewFlow: Dispatch<SetStateAction<boolean | undefined>>
}

export interface WorkflowEditorProps {
    editWf?: IFlow;
    workflows?: IFlowBase[];
    onOk: (result: IFlow) => void;
    onCancel: () => void
}