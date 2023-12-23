
import React from 'react';

import { useFlowGrapContext } from '../context';

import { IReportModule } from '@/interface/flow';

export default function CustomModuleGroup({ name, apimode }: IReportModule) {

    const { selectedGroup, setSelectedGroup } = useFlowGrapContext()
    return (
        <>
            <div
                className={`act-button flex-center w-fit px-3 !border-turbo-light ${selectedGroup === apimode ? 'selected' : ''}`}
                role="presentation"
                data-pr-tooltip={name}
                onClick={() => setSelectedGroup(pre => pre !== apimode ? apimode : undefined)}
            >
                {apimode}
            </div>
        </>
    )
}
