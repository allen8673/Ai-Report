
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';



export interface ReportItemProps {
    onClick?: () => void;
}

export default function AddButton({ onClick }: ReportItemProps) {
    return (
        <button
            onClick={onClick}
            className={`flex-center gap-2 
                m-std-min w-[40px] h-[40px] opacity-70
                bg-deep-strong border-turbo-deep border-[1px] border-dashed rounded-std`}
            data-pr-tooltip={'Add'}>
            <FontAwesomeIcon icon={faAdd} color={'white'} />
        </button>
    )
}
