
import { faQuestion } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

import { flowInfoMap } from '../configuration';

import { IFlowNodeBase } from '@/interface/flow';

export interface ReportItemProps extends IFlowNodeBase {
    onDelete?: () => void;
}

export default function ReportItem({ name, type }: ReportItemProps) {
    const { icon } = flowInfoMap[type] || { icon: faQuestion, color: 'rgba(255, 0, 0, 0.56)' }

    return (
        <>

            <div
                className={`act-button flex-center border-solid`}
                role="presentation" data-pr-tooltip={name}>
                <FontAwesomeIcon icon={icon} color={'white'} />
            </div>
        </>
    )
}
