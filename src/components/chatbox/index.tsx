import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";


interface ChatboxProps {
    initialValue?: string;
    buttonLabel?: string;
    onSend?: (content?: string) => void
    extention?: ReactNode | ((atcs: { setContent: Dispatch<SetStateAction<string | undefined>> }) => ReactNode);
}

export default function Chatbox({ initialValue: value, buttonLabel, extention, onSend }: ChatboxProps) {

    const [content, setContent] = useState<string>();
    useEffect(() => {
        setContent(value)
    }, [value])

    return <div className="flex flex-col w-full gap-2">
        <InputTextarea
            className={`
            shrink grow overflow-auto 
            bg-deep text-light border-light-weak border-[2px]
            focus:shadow-none
             `}
            autoResize
            value={content}
            onChange={(e) => {
                setContent(e.target.value)
            }}
        />
        <div className="w-full flex gap-2 justify-end py-2">
            {typeof extention === 'function' ? extention({ setContent }) : extention}
            <Button
                icon='pi pi-send'
                onClick={() => onSend?.(content)}
                label={buttonLabel || 'Send'}
            />
        </div>
    </div>

}