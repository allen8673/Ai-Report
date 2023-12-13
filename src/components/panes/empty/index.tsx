import { faInbox } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

interface EmptyPaneProps {
    title?: string;
    className?: string;
}
export default function EmptyPane({ title, className }: EmptyPaneProps) {
    return (
        <div className={`
        p-16
        bg-deep-weak
        text-light/[.3] text-xl 
        w-full h-full 
        flex flex-col grow justify-center items-center 
        border-solid border-light-weak rounded-std-sm 
        ${className || ''}`}>
            <FontAwesomeIcon className='!w-12 !h-12' icon={faInbox} />
            <p className='my-0'>{title || 'No Data'}</p>
        </div>)
}