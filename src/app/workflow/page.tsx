'use client'
import { faAdd, faEye, faPlayCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toString } from 'lodash'
import { useRouter } from "next/dist/client/components/navigation";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { SelectItem } from "primereact/selectitem";
import { useEffect, useState } from 'react'

import apiCaller from "@/api-helpers/api-caller";
import { coverToQueryString } from "@/api-helpers/url-helper";
import FileUploader from "@/components/file-uploader";
import Form from "@/components/form";
import { FormInstance } from "@/components/form/form";
import Modal from "@/components/modal";
import Table from "@/components/table";
import { Column } from "@/components/table/table";
import TitlePane from "@/components/title-pane";
import { ApiResult } from "@/interface/api";
import { IWorkflowBase } from "@/interface/workflow";
import { useLayoutContext } from "@/layout/context";
import RouterInfo, { getFullUrl } from "@/settings/router-setting";

interface FormData {
    id?: string;
    name?: string;
    template?: string
}

export default function Page() {
    const router = useRouter();
    const editorUrl = getFullUrl(RouterInfo.WORKFLOW_EDITOR);
    const { showMessage } = useLayoutContext();

    const [workflows, setWorkflow] = useState<IWorkflowBase[]>([]);
    const [addNewFlow, setAddNewFlow] = useState<boolean>();
    const [form, setForm] = useState<FormInstance<FormData>>()
    const [templateOpts, setTemplateOpts] = useState<SelectItem[]>([])
    const [runWorkflow, setRunWorkflow] = useState<IWorkflowBase>();



    const getAllData = async () => {
        const { workflow, template } = (await apiCaller.get<ApiResult<{
            workflow: IWorkflowBase[],
            template: IWorkflowBase[]
        }>>(`${process.env.NEXT_PUBLIC_FLOWS_API}/ALL`)).data.data || {};
        setWorkflow(workflow || []);
        setTemplateOpts(template?.map(t => ({ label: t.name, value: t.id })) || [])
    }

    useEffect(() => {
        getAllData();
    }, [])

    const columns: Column<IWorkflowBase>[] = [
        { key: 'id', title: 'ID', style: { width: '25%' } },
        { key: 'name', title: 'Name' },
        {
            style: { width: 80, padding: 0 },
            format: (row) => {
                return <div
                    className="flex gap-[7px] px-[12px]"
                    role='presentation'
                    onClick={(e) => e.stopPropagation()}>
                    <Button
                        className="py-0 px-[0px] "
                        severity='info'
                        tooltip="View the reports"
                        tooltipOptions={{ position: 'left' }}
                        icon={
                            <FontAwesomeIcon icon={faEye} />
                        } />
                    <Button
                        className="gap-[7px]"
                        severity='success'
                        label="Run"
                        icon={
                            <FontAwesomeIcon icon={faPlayCircle} />
                        }
                        onClick={() => setRunWorkflow(row)}
                    />
                </div >
            }
        }
    ]

    return <div className="flex h-full flex-col gap-std items-stretch text-light">
        <TitlePane
            title='WorkFlow List'
            postContent={
                <Button icon={<FontAwesomeIcon className='mr-[7px]' icon={faAdd} />}
                    severity="success"
                    label='Add New Workflow'
                    tooltipOptions={{ position: 'left' }}
                    onClick={() => {
                        setAddNewFlow(pre => !pre)
                    }}
                />
            }
        />
        <Table className='h-full' data={workflows} columns={columns}
            paginator rows={10}
            first={0}
            totalRecords={5}
            onRowClick={({ data }) => {
                const { id } = data
                router.push(`${editorUrl}${coverToQueryString({ id })}`);
            }}
        />
        <Modal visible={addNewFlow}
            onOk={() => {
                form?.submit()
                    .then(({ name, template }) => {
                        const queries: { [key: string]: string | undefined } = { name, template }
                        // if (!!template?.length) {
                        //     queries.template = template.map(t => t.value).join(',')
                        // }
                        router.push(`${editorUrl}${coverToQueryString(queries)}`);
                    }).catch(() => {
                        // 
                    });
            }}
            onCancel={() => {
                setAddNewFlow(false)
            }}>
            <Form
                onLoad={(form: FormInstance<FormData>) => {
                    setForm(form)
                }}
                onDestroyed={() => {
                    setForm(undefined)
                }}
            >
                {
                    ({ Item }) => (
                        <>
                            <Item name={'name'} label="Workflow Name" rules={{ required: 'Please give a name to workflow!', }}>
                                <InputText />
                            </Item>
                            <Item name={'template'} label="Template">
                                <Dropdown options={templateOpts} />
                            </Item>

                            {/* <List name='template' label="Template">{({ fields, append, remove, move }) => {
                                return <>
                                    <DndList
                                        items={fields}
                                        renderContent={(item, idx) => {
                                            return <div className="flex w-full mt-1">
                                                <Item className="grow" name={`template.${idx}.value`}>
                                                    <Dropdown options={templateOpts} />
                                                </Item>
                                                <Button
                                                    type='button'
                                                    severity='danger'
                                                    className="ml-1"
                                                    icon={<FontAwesomeIcon icon={faTrash} />}
                                                    onClick={(): void => {
                                                        remove(idx)
                                                    }}
                                                />
                                            </div>
                                        }}
                                        onDragEnd={({ source, destination }) => {
                                            if (destination?.index === undefined) return;
                                            move(source.index, destination.index)
                                        }}
                                    />
                                    <Button
                                        type='button'
                                        className="mt-2 w-full"
                                        icon={<FontAwesomeIcon icon={faAdd} />}
                                        onClick={(): void => {
                                            append({ value: '' })
                                        }}
                                    />
                                </>
                            }}
                            </List> */}
                        </>
                    )
                }</Form>
        </Modal>
        <Modal
            title="Upload your files"
            visible={!!runWorkflow}
            onOk={() => setRunWorkflow(undefined)}
            footerClass="flex justify-end"
            okLabel="Cancel"
        >
            <FileUploader
                uploadLabel="Upload & Run"
                onUpload={e => {
                    if (runWorkflow && e.files && e.files.length > 0) {
                        const formData = new FormData();
                        for (const i in e.files) {
                            formData.append('files', e.files[i])
                        }

                        formData.append('userId', '23224');
                        formData.append('workflowId', runWorkflow.id);
                        formData.append('version', '1');

                        apiCaller.post<ApiResult>(`${process.env.NEXT_PUBLIC_REPORT}/run`, formData, {
                            headers: {
                                "Content-Type": "multipart/form-data",
                                // "x-rapidapi-host": "file-upload8.p.rapidapi.com",
                                // "x-rapidapi-key": "your-rapidapi-key-here",
                            },
                        }).then((rep) => {
                            showMessage({
                                message: rep.data.message || 'success',
                                type: 'success'
                            })
                            setRunWorkflow(undefined);
                        }).catch((error) => {
                            showMessage({
                                message: toString(error),
                                type: 'error'
                            })
                        });
                    }
                }}
            />
        </Modal>
    </div >
}
