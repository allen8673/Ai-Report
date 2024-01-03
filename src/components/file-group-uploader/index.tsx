'use client'
import { faAdd, faCloudUpload, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { concat, keys, map } from "lodash";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Button } from "primereact/button";
import React, { useRef, useState } from "react";

import EmptyPane from "../panes/empty";

import { FileGroups, GroupingFileUploaderProps, HeaderTemplateProps, ItemTemplateProps } from "./file-group-uploader";

import { cn } from "@/lib/utils";

function ItemTemplate({ group, file, onDelete }: ItemTemplateProps) {
    return (
        <div className={cn`
        h-[55px] my-1 px-3 
        gap-[7px] bg-deep-weak text-light rounded-std-sm
        flex items-center`}>
            {/* <span className="h-[40px] w-[40px] text-center">{
                !!file?.objectURL ?
                    <img alt='' src={file?.objectURL} className="w-full h-full" /> :
                    <FontAwesomeIcon className="w-full h-full" icon={faFile} />
            }</span> */}
            <div className="flex grow items-center [&>div]:text-left">
                <div className="flex flex-column grow">
                    <div>{file.name}</div>
                    <div>{file.size}</div>
                </div>
                <Button
                    type='button'
                    severity='danger'
                    icon={<FontAwesomeIcon icon={faTrash} />}
                    onClick={() => onDelete?.(group, file)}
                // onClick={(e) => { opts.onRemove(e) }}
                />
            </div>
        </div>
    )
}

function HeaderTemplate({ title, opts, onFilesSelect }: HeaderTemplateProps) {
    const ref = useRef<HTMLInputElement>(null);

    return (
        <div className={cn('flex grow justify-between items-center', opts.className)} role='presentation'
        >
            <input type="file" hidden multiple accept="*" ref={ref}
                onClick={e => e.stopPropagation()}
                onChange={e => {
                    onFilesSelect?.(map(e.target.files, f => f))
                }}

            />
            <span className="text-xl text-light">{title}</span>
            <span>
                <Button
                    className="custom-choose-btn p-button-rounded p-button-outlined border-2"
                    style={{ color: '#BA4AFF' }}
                    size='small'
                    icon={<FontAwesomeIcon className="w-[18px] h-[18px]  p-[3px]" icon={faAdd} />}
                    onClick={(e) => {
                        ref.current?.click();
                        e.stopPropagation();
                    }}
                />
            </span>
        </div>
    )
}

export default function FileGroupUploader({ grouping, onUpload, uploadLabel }: GroupingFileUploaderProps) {

    const [fileGroups, setFileGroups] = useState<FileGroups>({});
    const _grouping: string[] = (!!grouping && grouping.length > 1) ? grouping : ['file']

    const onDelete = (group: string, file: File) => {
        setFileGroups(pre => {
            const fileGrp = pre[group]
            const result = (fileGrp || [])?.filter(f => f !== file);
            (result.length ? () => { pre[group] = result } : () => { delete pre[group] })();
            return { ...pre }
        })
    }

    return <div>
        <Accordion >
            {map(_grouping, group => {
                const files = fileGroups[group]
                return (
                    <AccordionTab
                        className="[&>a]:py-2"
                        headerTemplate={opts => (
                            <HeaderTemplate title={group} opts={opts} onFilesSelect={f => {
                                setFileGroups(pre => ({ ...pre, [group]: concat(pre[group] || [], f) }))
                            }} />
                        )}
                    >
                        <div className="bg-deep">
                            {!!files?.length ?
                                map(files, f => (
                                    <ItemTemplate group={group} file={f} onDelete={onDelete} />
                                )) :
                                <EmptyPane title={`Please selected files for ${group}`} />
                            }
                        </div>
                    </AccordionTab >
                )
            })}
        </Accordion>
        <div className={cn`flex-center justify-end  h-[55px] mt-0 px-0`}>
            <Button
                className='custom-upload-btn p-button-rounded p-button-outlined border-2'
                label={uploadLabel || 'Upload Files'}
                icon={<FontAwesomeIcon className="w-[18px] h-[18px] p-[3px]" icon={faCloudUpload} />}
                style={{ color: '#2a8af6' }}
                onClick={() => onUpload(fileGroups)}
                disabled={keys(fileGroups).length !== _grouping.length}
            />
        </div>
    </div>
}