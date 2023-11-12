'use client'
import { useState } from "react";

import FlowEditor from "@/containers/flow-editor";
import { IWorkflow } from "@/interface/workflow";
import { mock_projects } from "@/mock-data/mock";

export default function Page() {

    const [workflow, setWorkflow] = useState<IWorkflow>(mock_projects[0]);

    return (
        <FlowEditor workflow={workflow} onSave={wf => { setWorkflow(wf) }} />
    );
}