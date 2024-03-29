import { SelectItem } from "primereact/selectitem";
import { Dispatch, SetStateAction } from 'react'

import { IFlow, IFlowBase } from "@/interface/flow";

export interface NewWorkflowModalProps {
    addNewFlow?: boolean;
    templateOpts: SelectItem[];
    setAddNewFlow: Dispatch<SetStateAction<boolean | undefined>>
}

export interface WorkflowCreatorProps {
    openCreator?: boolean;
    templateOpts: SelectItem[];
    onCancel: () => void;
    onOk: (result: IFlow) => void;
}

export interface WorkflowEditorProps {
    workflow?: IFlow;
    workflows?: IFlowBase[];
    onOk: (result: IFlow) => void;
    onCancel: () => void;
    okLabel?: string;
}

export interface WorkflowPreviewerProps {
    onEdit?: (wf: IFlow) => void;
    onRemove?: (wf: IFlow) => void;
    onAddTemplate?: (wf: IFlow) => void;
}

export interface TemplateCreatorProps {
    openCreator?: boolean;
    workflow?: IFlow
    onCancel: () => void;
    onOk: (result: IFlow) => void;
}