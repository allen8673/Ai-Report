
import React from 'react';

import { useFlowGrapContext } from '../context';

import { ComponentOpt } from '@/interface/flow';

export default function CustomModuleGroup({ comp }: { comp?: ComponentOpt }) {

    const { COMP_NAME, APIMODE } = comp || {}
    const { selectedGroup, setSelectedGroup } = useFlowGrapContext()
    return (
        <div
            className={`actbar-tooltip act-button
            flex-center w-fit px-3 !border-turbo-light ${selectedGroup === APIMODE ? 'selected' : ''}`}
            role="presentation"
            data-pr-tooltip={`Click to show the ${APIMODE} group`}
            onClick={() => setSelectedGroup(pre => pre !== APIMODE ? APIMODE : undefined)}
        >
            {COMP_NAME}
        </div>
    )
}
