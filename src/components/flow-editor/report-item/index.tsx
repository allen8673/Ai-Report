
import { faQuestion } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

import { flowInfoMap } from '../configuration';

import { IFlowBase } from '@/interface/workflow';
import './report-item.css';

export interface ReportItemProps extends IFlowBase {
    onDelete?: () => void;
}

export default function ReportItem({ name, type }: ReportItemProps) {
    const { icon } = flowInfoMap[type] || { icon: faQuestion, color: 'rgba(255, 0, 0, 0.56)' }

    const className = `report-item
     flex-center 
     gap-2 
     m-std-min 
     w-[40px] 
     h-[40px] 
     grow 
     bg-deep-strong 
     border-turbo-deep 
     border-[1px] 
     border-solid 
     rounded-std`;

    return (
        <>

            <div
                className={className}
                role="presentation" data-pr-tooltip={name}>
                <span className="icon" >
                    <FontAwesomeIcon icon={icon} color={'white'} />
                </span>
            </div>
        </>
    )
}
