
import { faQuestion } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

import { flowInfoMap } from '../configuration';

import { IReportCompData } from '@/interface/flow';

export default function ReportModule({ name, comp_type: type }: IReportCompData) {
    const { icon } = flowInfoMap[type] || { icon: faQuestion }

    return (
        <>
            <div
                className={`actbar-tooltip act-button w-[40px] flex-center`}
                role="presentation" data-pr-tooltip={name}>
                <FontAwesomeIcon icon={icon} color={'white'} />
            </div>
        </>
    )
}
