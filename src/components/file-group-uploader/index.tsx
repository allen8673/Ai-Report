'use client'
import { faAdd, faCloudUpload, faEraser, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { concat, map } from "lodash";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Button } from "primereact/button";
import React, { MutableRefObject, useEffect, useImperativeHandle, useRef, useState } from "react";

import EmptyPane from "../panes/empty";

import { FGUploaderContext, useFGUploaderContext } from "./context";
import { FileGroupUploaderInstance, FileGroups, GroupingFileUploaderProps, HeaderTemplateProps, ItemTemplateProps } from "./file-group-uploader";

import { cn } from "@/lib/utils";

function ItemTemplate({ group, file }: ItemTemplateProps) {
    const { deleteFile } = useFGUploaderContext();
    return (
        <div className={cn`
        h-[55px] my-1 px-3 
        gap-[7px] bg-deep-weak text-light rounded-std-sm
        flex items-center`}>
            <div className="flex grow items-center [&>div]:text-left">
                <div className="flex flex-column grow">
                    <div>{file.name}</div>
                    <div>{file.size}</div>
                </div>
                <Button
                    type='button'
                    severity='danger'
                    icon={<FontAwesomeIcon icon={faTrash} />}
                    onClick={() => deleteFile?.(group, file)}
                />
            </div>
        </div>
    )
}

function HeaderTemplate({ group, opts }: HeaderTemplateProps) {
    const ref = useRef<HTMLInputElement>(null);
    const { onFilesSelect, fileGroups, deleteGroup } = useFGUploaderContext();

    return (
        <div className={cn('flex grow justify-between items-center', opts.className)} role='presentation'
        >
            <input type="file" hidden multiple accept="*" ref={ref}
                onClick={e => e.stopPropagation()}
                onChange={e => {
                    onFilesSelect(group, map(e.target.files, f => f))
                }}
            />
            <span className="flex-center gap-2">
                {!!fileGroups[group]?.length
                    ? <i className="pi pi-check-circle text-success" />
                    : <i className="pi pi-exclamation-circle text-warning" />
                }
                <span className="text-xl text-light">{group}</span>
            </span>
            <span className="flex-center gap-2">
                <Button
                    className="custom-choose-btn p-button-rounded p-button-outlined border-2"
                    style={{ color: 'rgba(185, 28, 28, 1)' }}
                    size='small'
                    icon={<FontAwesomeIcon className="w-[18px] h-[18px]  p-[3px]" icon={faEraser} />}
                    onClick={(e) => {
                        e.stopPropagation();
                        deleteGroup(group)
                    }}
                />
                <Button
                    className="custom-choose-btn p-button-rounded p-button-outlined border-2"
                    style={{ color: '#BA4AFF' }}
                    size='small'
                    icon={<FontAwesomeIcon className="w-[18px] h-[18px]  p-[3px]" icon={faAdd} />}
                    onClick={(e) => {
                        e.stopPropagation();
                        ref.current?.click();
                    }}
                />
            </span>
        </div>
    )
}

export const useFileGroupUploader = (): { uploaderRef: MutableRefObject<FileGroupUploaderInstance> } => {
    const uploaderRef = useRef<FileGroupUploaderInstance>({
        upload: () => { },
    });
    return { uploaderRef }
}

export default function FileGroupUploader(props: GroupingFileUploaderProps) {

    const {
        grouping,
        onUpload,
        uploadLabel,
        uploaderRef,
        hideUploadButton,
        onChange
    } = props;
    const _grouping: string[] = (!!grouping && grouping.length > 0) ? grouping : ['file'];
    const [fileGroups, setFileGroups] = useState<FileGroups>({});

    /**
     * Announce exposed functionalities by ref
     */
    useImperativeHandle<FileGroupUploaderInstance, FileGroupUploaderInstance>(uploaderRef, () => ({
        upload: () => onUpload(fileGroups),
    }));

    useEffect(() => {
        onChange?.(fileGroups)
    }, [fileGroups])

    const onFilesSelect = (group: string, files: File[]) => {
        setFileGroups(pre => ({ ...pre, [group]: concat(pre[group] || [], files) }))
    }

    const deleteFile = (group: string, file: File) => {
        setFileGroups(pre => {
            const fileGrp = pre[group]
            const result = (fileGrp || [])?.filter(f => f !== file);
            (result.length ? () => { pre[group] = result } : () => { delete pre[group] })();
            return { ...pre }
        })
    }

    const deleteGroup = (group: string) => {
        setFileGroups(pre => {
            delete pre[group]
            return { ...pre }
        })
    }

    return (
        <FGUploaderContext.Provider value={{ deleteFile, deleteGroup, onFilesSelect, fileGroups }}>
            <div>
                <Accordion >
                    {map(_grouping, (group, idx) => {
                        const files = fileGroups[group]
                        return (
                            <AccordionTab
                                key={`file-group-${idx}`}
                                className="[&>a]:py-2"
                                headerTemplate={opts => (
                                    <HeaderTemplate group={group} opts={opts} />
                                )}
                            >
                                <div className="bg-deep">
                                    {!!files?.length ?
                                        map(files, f => (
                                            <ItemTemplate group={group} file={f} />
                                        )) :
                                        <EmptyPane title={`Please selected files for ${group}`} />
                                    }
                                </div>
                            </AccordionTab >
                        )
                    })}
                </Accordion>
                {!hideUploadButton &&
                    <div className={cn`flex-center justify-end h-[55px] mt-0 px-0`}>
                        <Button
                            className='custom-upload-btn p-button-rounded p-button-outlined border-2'
                            label={uploadLabel || 'Upload Files'}
                            icon={<FontAwesomeIcon className="w-[18px] h-[18px] p-[3px]" icon={faCloudUpload} />}
                            style={{ color: '#2a8af6' }}
                            onClick={() => onUpload(fileGroups)}
                        />
                    </div>
                }
            </div>
        </FGUploaderContext.Provider>
    )
}