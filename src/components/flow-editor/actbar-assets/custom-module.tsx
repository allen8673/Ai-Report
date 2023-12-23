
import React from 'react';

import { IReportModule } from '@/interface/flow';

export default function CustomModule(props: IReportModule & { onClick?: (module: IReportModule) => void }) {

    const { name, onClick } = props;

    return (
        <div
            className={`actbar-tooltip act-button !h-[30px] flex-center w-fit px-2 min-w-[40px] !text-[12px] !border-turbo-light`}
            role="presentation" onClick={() => onClick?.(props)} data-pr-tooltip={name}>
            {name}
        </div>
    )
}
