
import { faQuestion } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react';

import { flowInfoMap } from '../mapper';
import { IReportItem } from "../type";

import './report-item.css';
import GradientBorder from '@/components/gradient-border';

export interface ReportItemProps extends IReportItem {
    onDelete?: () => void;
    onClick?: (id: string) => void;
    onSelected?: boolean;
}

export default function ReportItem({ id, name, type, onSelected, onClick }: ReportItemProps) {
    const { icon, color } = flowInfoMap[type] || { icon: faQuestion, color: 'rgba(255, 0, 0, 0.56)' }
    return <GradientBorder className='rounded-std-sm' borderClass='rounded-std-sm' onSelected={onSelected}>
        <div
            className='report-item flex-center gap-2 px-[12px] py-[7px] h-[50px] grow'
            role="presentation"
            onClick={(): void => { onClick?.(id); }}>
            <span className="icon circle-border">
                <FontAwesomeIcon icon={icon} color={color} />
            </span>
            <div className="name text-std-light">{name}</div>
            {/* <FontAwesomeIcon onClick={onDelete} className='w-4 h-4 cursor-default' color='rgba(255, 0, 0, 0.56)' icon={faTrash} /> */}
        </div>
    </GradientBorder>
}
