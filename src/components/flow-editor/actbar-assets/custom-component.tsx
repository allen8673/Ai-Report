
import React from 'react';

import { ICustomCompData } from '@/interface/flow';

export default function CustomComponent(props: ICustomCompData & { onClick?: (module: ICustomCompData) => void }) {

    const { name, onClick } = props;

    return (
        <div
            className={`
            actbar-tooltip act-button 
            !h-[30px] flex-center w-fit px-2 !text-[12px] opacity-80`}
            role="presentation" onClick={() => onClick?.(props)} data-pr-tooltip={name}>
            {name}
        </div>
    )
}
