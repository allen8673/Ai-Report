import { faBook, faQuestion, faFile, faFolder } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react';

import { IReportItem } from "../type";
import './report-item.css';

const iconMap: { [type: string]: React.JSX.Element } = {
    'type-1': <FontAwesomeIcon color='#517ECB' icon={faBook} />,
    'type-2': <FontAwesomeIcon color='#51CBB3' icon={faFile} />,
    'type-3': <FontAwesomeIcon color='#CBC751' icon={faFolder} />
};

export default function ReportItem({ name, type }: IReportItem) {
    return <div className="report-item flex-center std-border bg-[#FAFAFA]" >
        <span className="icon circle-border">
            {iconMap[type] || <FontAwesomeIcon icon={faQuestion} />}
        </span>
        <div className="name">{name}</div></div>
}