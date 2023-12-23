
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';



export interface ReportItemProps {
    onClick?: () => void;
}

export default function AddButton({ onClick }: ReportItemProps) {
    return (
        <button
            className={`actbar-tooltip act-button flex-center border-dashed cursor-pointer`}
            onClick={onClick}
            data-pr-tooltip={'Add Module'}>
            <FontAwesomeIcon icon={faAdd} color={'white'} />
        </button>
    )
}
