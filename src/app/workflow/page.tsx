'use client'
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import _ from "lodash";
import { useRouter } from "next/dist/client/components/navigation";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import { SelectItem } from "primereact/selectitem";
import { useEffect, useState } from 'react'

import Form from "@/components/form";
import { FormInstance } from "@/components/form/form";
import Modal from "@/components/modal";
import Table from "@/components/table";
import { Column } from "@/components/table/table";
import TitlePane from "@/components/title-pane";
import { IEditWorkflow, ITemplate, IWorkflow } from "@/interface/workflow";
import RouterInfo, { getFullUrl } from "@/settings/router-setting";
import { coverToQueryString } from "@/untils/urlHelper";

export default function Page() {


    const [workflows, setWorkflow] = useState<IWorkflow[]>([]);
    const [addNewFlow, setAddNewFlow] = useState<boolean>();
    const [form, setForm] = useState<FormInstance<IEditWorkflow>>()
    const [templateOpts, setTemplateOpts] = useState<SelectItem[]>([])

    const router = useRouter();
    const editorUrl = getFullUrl(RouterInfo.WORKFLOW_EDITOR);

    const getTemplateOpts = async () => {
        const res = await axios.get(`${(process.env.NEXT_PUBLIC_API_HOST || '')}${process.env.NEXT_PUBLIC_TEMPLATE_API}`);
        const opts = _.map<ITemplate, SelectItem>(res.data || [], t => ({ label: t.name, value: t.id }))
        setTemplateOpts(opts)
    }

    const getWorkflows = async () => {
        const rsp = await axios.get<IWorkflow[]>(`${(process.env.NEXT_PUBLIC_API_HOST || '')}${process.env.NEXT_PUBLIC_WORKFLOW_API}`);
        setWorkflow(rsp.data)
    }

    useEffect(() => {
        getWorkflows()
        getTemplateOpts()
    }, [])

    const columns: Column<IWorkflow>[] = [
        { key: 'id', title: 'ID', style: { width: '25%' } },
        { key: 'name', title: 'Name' }
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
                        router.push(`${editorUrl}${coverToQueryString({ name, template: _.join(template || [], ',') })}`);
                    }).catch(() => {
                        // 
                    });
            }}
            onCancel={() => {
                setAddNewFlow(false)
            }}>
            <Form
                onLoad={(form: FormInstance<IEditWorkflow>) => setForm(form)}
                onDestroyed={() => {
                    setForm(undefined)
                }}
            >
                {
                    Item => (
                        <>
                            <Item name={'name'} label="Workflow Name" rules={{ required: 'Please give a name to workflow!', }}>
                                <InputText />
                            </Item>
                            <Item name={'template'} label="Apply Template">
                                <MultiSelect options={templateOpts} />
                            </Item>
                        </>
                    )
                }</Form>
        </Modal>
    </div >
}
