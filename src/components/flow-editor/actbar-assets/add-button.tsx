
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';



export interface ReportItemProps {
    onClick?: () => void;
}

export default function AddButton({ onClick }: ReportItemProps) {
    return (
        <button
            className={`act-button flex-center border-dashed`}
            onClick={onClick}
            data-pr-tooltip={'Add'}>
            <FontAwesomeIcon icon={faAdd} color={'white'} />
        </button>
    )
}
