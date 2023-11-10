import { faQuestion, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react';

import { iconMap } from '../mapper';
import { IReportItem } from "../type";
import './report-item.css';

export interface ReportItemProps extends IReportItem {
    onDelete?: () => void;
}



export default function ReportItem({ name, type, onDelete }: ReportItemProps) {
    const { icon, color } = iconMap[type] || { icon: faQuestion, color: 'rgba(255, 0, 0, 0.56)' }
    return <div className="report-item std-sm-rounded std-text-color p-[1px] bg-turbo" >
        <div className='wrapper flex-center std-sm-rounded std-light-bg'>
            <span className="icon circle-border">
                <FontAwesomeIcon icon={icon} color={color} />
            </span>
            <div className="name">{name}</div>
            <FontAwesomeIcon onClick={onDelete} className='w-4 h-4 cursor-default' color='rgba(255, 0, 0, 0.56)' icon={faTrash} />
        </div>

    </div>
}
