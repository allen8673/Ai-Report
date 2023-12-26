'use client'
import { faAdd, faEye, faPlayCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/dist/client/components/navigation";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { SelectItem } from "primereact/selectitem";
import { useEffect, useState } from 'react'

import { getAll } from "@/api-helpers/flow-api";
import { coverToQueryString } from "@/api-helpers/url-helper";
import Form from "@/components/form";
import { FormInstance } from "@/components/form/form";
import Modal from "@/components/modal";
import TitlePane from "@/components/panes/title";
import Table from "@/components/table";
import { Column } from "@/components/table/table";
import { IFlowBase } from "@/interface/flow";
import { useWfLayoutContext } from "@/layout/workflow-layout/context";
import { getFullUrl } from "@/lib/router-helper";
import RouterInfo from "@/settings/router-setting";

interface FormData {
    id?: string;
    name?: string;
    template?: string
}

export default function Page() {
    const router = useRouter();
    const editorUrl = getFullUrl(RouterInfo.WORKFLOW_EDITOR);
    const { runWorkflow, viewReports } = useWfLayoutContext()

    const [workflows, setWorkflow] = useState<IFlowBase[]>([]);
    const [addNewFlow, setAddNewFlow] = useState<boolean>();
    const [form, setForm] = useState<FormInstance<FormData>>()
    const [templateOpts, setTemplateOpts] = useState<SelectItem[]>([])

    const getAllData = async () => {
        const { workflow, template } = await getAll() || {};
        setWorkflow(workflow || []);
        setTemplateOpts(template?.map(t => ({ label: t.name, value: t.id })) || [])
    }

    useEffect(() => {
        getAllData();
    }, [])

    const columns: Column<IFlowBase>[] = [
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
                        className="py-0 px-[0px] h-[40px]"
                        severity='success'
                        tooltip="Run Workflow"
                        tooltipOptions={{ position: 'left' }}
                        icon={
                            <FontAwesomeIcon icon={faPlayCircle} />
                        }
                        onClick={() => runWorkflow(row.id)}
                    />
                    <Button
                        className="gap-[7px] h-[40px]"
                        severity='info'
                        label="Reports"
                        icon={
                            <FontAwesomeIcon icon={faEye} />
                        }
                        onClick={() => viewReports(row.id)}
                    />
                </div >
            }
        }
    ]

    return <div className="page-std">
        <TitlePane
            title='WorkFlow'
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
                }
            </Form>
        </Modal>
    </div >
}
