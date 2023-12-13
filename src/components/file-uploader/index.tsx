'use client'
import { faAdd, faCloudUpload, faEraser, faFile, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "primereact/button";
import { FileUpload, FileUploadHandlerEvent, FileUploadHeaderTemplateOptions, FileUploadOptions, ItemTemplateOptions } from "primereact/fileupload";
import { Tooltip } from "primereact/tooltip";

import EmptyPane from "../panes/empty";

export interface FileUploaderProps {
    name?: string;
    onUpload: (e: FileUploadHandlerEvent) => void,
    uploadLabel?: string
}

function HeaderTemplate(opts: FileUploadHeaderTemplateOptions) {
    return (
        <div
            className={`
            h-[60px] px-[12px]
            rounded-std-sm 
            border-solid
            border-light-weak
            flex items-center justify-between
            `}>
            <span className="flex gap-1">
                {opts.chooseButton}
                {opts.cancelButton}
            </span>
            <span className="flex gap-1">
                {opts.uploadButton}
            </span>
        </div>
    )

}

function ItemTemplate(file: any, opts: ItemTemplateOptions) {
    const _file = (file as File);
    return (
        <div className="flex items-center gap-[7px] h-[45px] my-1">
            <span className="h-[40px] w-[40px] text-center">{
                !!file?.objectURL ?
                    <img alt='' src={file?.objectURL} className="w-full h-full" /> :
                    <FontAwesomeIcon className="w-full h-full" icon={faFile} />
            }</span>
            <div className="flex grow items-center [&>div]:text-left">
                <div className="flex flex-column grow">
                    <div>{_file.name}</div>
                    <div>{_file.size}</div>
                </div>
                <Button
                    type='button'
                    severity='danger'
                    icon={<FontAwesomeIcon icon={faTrash} />}
                    onClick={(e) => { opts.onRemove(e) }}
                />
            </div>
        </div>
    )
}

export default function FileUploader({ name, onUpload, uploadLabel }: FileUploaderProps) {

    const chooseOptions: FileUploadOptions = {
        icon: <FontAwesomeIcon
            className="w-[18px] h-[18px]  p-[3px]"
            icon={faAdd}
        />,
        iconOnly: true,
        className: 'custom-choose-btn p-button-rounded p-button-outlined border-2',
        style: { color: '#BA4AFF' }
    }

    const uploadOptions: FileUploadOptions = {
        icon: <FontAwesomeIcon
            className="w-[18px] h-[18px] p-[3px]"
            icon={faCloudUpload}
        />,
        label: uploadLabel,
        className: 'custom-upload-btn p-button-rounded p-button-outlined border-2',
        style: { color: '#2a8af6' }
    }

    const cancelOptions: FileUploadOptions = {
        icon: <FontAwesomeIcon
            className="w-[18px] h-[18px] p-[3px]"
            icon={faEraser}
        />,
        iconOnly: true,
        className: 'custom-cancel-btn p-button-rounded p-button-outlined border-2',
        style: { color: 'rgba(185, 28, 28, 1)' }
    }

    return <>
        <Tooltip target=".custom-choose-btn" content="Add files" position="bottom" />
        <Tooltip target=".custom-cancel-btn" content="Clear files" position="bottom" />
        <FileUpload
            name={name || "uploader"}
            mode='advanced'
            contentClassName="rounded-sm mt-1"
            customUpload
            headerTemplate={HeaderTemplate}
            emptyTemplate={<EmptyPane className="border-dashed" title="Drag and drop files to here to upload" />}
            progressBarTemplate={<></>}
            itemTemplate={ItemTemplate}
            chooseOptions={chooseOptions}
            uploadOptions={uploadOptions}
            cancelOptions={cancelOptions}
            multiple
            accept="*"
            uploadHandler={onUpload}
        />
    </>
}