import { MouseEventHandler } from "react";

import { cn } from "@/lib/utils";

interface LoadingPaneProps {
    title?: string;
    className?: string;
    onClick?: MouseEventHandler<HTMLDivElement>
}
export default function LoadingPane({ title, className, onClick }: LoadingPaneProps) {
    return (
        <div
            className={cn(`
            p-16
            bg-deep
            text-light/[.7] text-xl 
            w-full h-full 
            flex flex-col grow justify-center items-center
            border-solid border-light-weak rounded-std-sm
            `, (!!onClick ? 'cursor-pointer' : ""), className)}
            onClick={onClick}
            role='presentation'
        >
            <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }} />
            <p className='my-0'>{title || 'Loading'}</p>
        </div>)
}