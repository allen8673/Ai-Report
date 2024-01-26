import { MouseEventHandler } from "react";

import { cn } from "@/lib/utils";

interface EmptyPaneProps {
    title?: string;
    icon?: string;
    className?: string;
    onClick?: MouseEventHandler<HTMLDivElement>
}
export default function EmptyPane({ title, icon, className, onClick }: EmptyPaneProps) {
    return (
        <div
            className={cn(`
            p-16
            bg-deep-weak
            text-light/[.3] text-xl 
            w-full h-full 
            flex flex-col grow justify-center items-center
            border-solid border-light-weak rounded-std-sm
            `, (!!onClick ? 'cursor-pointer' : ""), className)}
            onClick={onClick}
            role='presentation'
        >
            <i className={`pi ${icon || "pi-inbox"}`} style={{ fontSize: '3rem' }} />
            <p className='my-0'>{title || 'No Data'}</p>
        </div>)
}