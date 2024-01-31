import { MouseEventHandler, PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

interface EmptyPaneProps {
    title?: string;
    icon?: string;
    className?: string;
    onClick?: MouseEventHandler<HTMLDivElement>;
    isEmpty?: boolean;
}
export default function EmptyPane({ title, icon, className, onClick, isEmpty = true, children }: PropsWithChildren<EmptyPaneProps>) {
    return isEmpty ? (
        <div
            className={cn(`
            p-16
            bg-deep-weak
            text-light/[.3] text-xl 
            w-full h-full 
            flex flex-col grow justify-center items-center
            border-solid border-light-weak rounded-std-sm
            `, (!!onClick ? 'cursor-pointer' : ""), className)}
            onClick={isEmpty && onClick}
            role='presentation'
        >
            <i className={`pi ${icon || "pi-inbox"}`} style={{ fontSize: '3rem' }} />
            <p className='my-0'>{title || 'No Data'}</p>

        </div>
    ) : children

}