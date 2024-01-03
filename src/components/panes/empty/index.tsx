import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { IconDefinition as regularIcon } from "@fortawesome/free-regular-svg-icons";
import { IconDefinition as solidIcon, faInbox } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { cn } from "@/lib/utils";

interface EmptyPaneProps {
    title?: string;
    icon?: regularIcon | solidIcon;
    className?: string;
}
export default function EmptyPane({ title, icon, className }: EmptyPaneProps) {
    return (
        <div className={cn(`
        p-16
        bg-deep-weak
        text-light/[.3] text-xl 
        w-full h-full 
        flex flex-col grow justify-center items-center 
        border-solid border-light-weak rounded-std-sm 
        `, className)}>
            <FontAwesomeIcon className='!w-12 !h-12' icon={(icon || faInbox) as IconProp} />
            <p className='my-0'>{title || 'No Data'}</p>
        </div>)
}