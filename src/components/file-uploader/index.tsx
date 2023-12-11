'use client'
import { faAdd, faCloudUpload, faEraser, faFile, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FileUpload, FileUploadHandlerEvent } from "primereact/fileupload";
import { Tooltip } from "primereact/tooltip";


export interface FileUploaderProps {
    name?: string;
    onUpload: (e: FileUploadHandlerEvent) => void,
    uploadLabel?: string
}

export default function FileUploader({ name, onUpload, uploadLabel }: FileUploaderProps) {

    return <>
        <Tooltip target=".custom-choose-btn" content="Add files" position="bottom" />
        <Tooltip target=".custom-cancel-btn" content="Clear files" position="bottom" />

        <FileUpload
            name={name || "uploader"}
            mode='advanced'
            contentClassName="rounded-sm mt-1"
            headerTemplate={(opts) => {
                return <div
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
            }}
            customUpload
            emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>}
            itemTemplate={(file: any, opts) => {
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
                            <FontAwesomeIcon
                                className=''
                                icon={faTrash}
                                onClick={(e) => { opts.onRemove(e) }}
                            />
                        </div>
                    </div>
                )
            }}
            chooseOptions={{
                icon: <FontAwesomeIcon
                    className="w-[18px] h-[18px]  p-[3px]"
                    icon={faAdd}
                />,
                iconOnly: true,
                className: 'custom-choose-btn p-button-rounded p-button-outlined border-2',
                style: { color: '#BA4AFF' }
            }}
            uploadOptions={{
                icon: <FontAwesomeIcon
                    className="w-[18px] h-[18px] p-[3px]"
                    icon={faCloudUpload}
                />,
                // iconOnly: true,
                label: uploadLabel,
                className: 'custom-upload-btn p-button-rounded p-button-outlined border-2',
                style: { color: '#2a8af6' }
            }}
            cancelOptions={{
                icon: <FontAwesomeIcon
                    className="w-[18px] h-[18px] p-[3px]"
                    icon={faEraser}
                />,
                iconOnly: true,
                className: 'custom-cancel-btn p-button-rounded p-button-outlined border-2',
                style: { color: 'rgba(185, 28, 28, 1)' }
            }}
            multiple
            accept="*"
            uploadHandler={onUpload}
        // uploadHandler={e => {
        //     if (workflow && e.files && e.files.length > 0) {
        //         const formData = new FormData();
        //         for (const i in e.files) {
        //             formData.append('files', e.files[i])
        //         }

        //         formData.append('userId', '23224');
        //         formData.append('workflowId', workflow.id);
        //         formData.append('version', '1');

        //         apiCaller.post<ApiResult>(`${process.env.NEXT_PUBLIC_REPORT}/run`, formData, {
        //             headers: {
        //                 "Content-Type": "multipart/form-data",
        //                 // "x-rapidapi-host": "file-upload8.p.rapidapi.com",
        //                 // "x-rapidapi-key": "your-rapidapi-key-here",
        //             },
        //         });
        //     }
        // }}
        />
    </>
}