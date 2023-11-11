'use client'

import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';

import Table from '@/components/table';
import { Column } from '@/components/table/table';
import TitlePane from '@/components/title-pane';
import { IWorkflow } from '@/interface/workflow';
import { mock_projects } from '@/mock-data/mock';
import RouterInfo, { getFullUrl } from '@/settings/router-setting';


export default function FlowList() {
    const router = useRouter();
    const editorUrl = getFullUrl(RouterInfo.WORKFLOW_EDITOR);
    const columns: Column<IWorkflow>[] = [
        { key: 'id', title: 'ID' },
        { key: 'name', title: 'Name' }
    ]

    return <div className="flex h-full flex-col gap-std items-stretch text-light">
        <TitlePane
            title='WorkFlow List'
            postContent={
                <>
                    <Button icon={<FontAwesomeIcon className='mr-[7px]' icon={faAdd} />}
                        severity="success"
                        label='Add New Workflow'
                        tooltipOptions={{ position: 'left' }}
                        onClick={() => router.push(editorUrl)
                        }
                    />
                </>}
        />
        <Table className='' data={mock_projects} columns={columns}
            paginator rows={10}
            first={0}
            totalRecords={5}
            onRowClick={() => {
                router.push(editorUrl)
            }}
        />
    </div>
}