import { faInbox } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

interface EmptyPaneProps {
    title?: string
}
export default function EmptyPane({ title }: EmptyPaneProps) {
    return (
        <div className={`
        bg-deep-weak
        text-light text-xl 
        w-full h-full 
        flex flex-col grow justify-center items-center 
        border-solid border-light-weak rounded-std-sm `}>
            <FontAwesomeIcon className='!w-16 !h-16' icon={faInbox} />
            <p className='my-0'>{title || 'No Data'}</p>
        </div>)
}