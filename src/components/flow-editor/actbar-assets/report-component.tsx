
import React from 'react';

import { flowInfoMap } from '../configuration';

import { IReportCompData } from '@/interface/flow';

export default function ReportComponent({ name, comp_type: type }: IReportCompData) {
    const { icon } = flowInfoMap[type] || { icon: 'pi-question' }

    return (
        <>
            <div
                className={`actbar-tooltip act-button w-[40px] flex-center`}
                role="presentation" data-pr-tooltip={name}>
                <i className={`pi ${icon}`} />
            </div>
        </>
    )
}
