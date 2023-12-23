
import React from 'react';

import { IReportModule } from '@/interface/flow';

export default function CustomModule({ name }: IReportModule) {

    return (
        <>
            <div
                className={`act-button !h-[30px] flex-center w-fit px-2 min-w-[40px] !text-[12px] !border-turbo-light`}
                role="presentation" data-pr-tooltip={name}>
                {name}
            </div>
        </>
    )
}
