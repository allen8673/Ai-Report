'use client'
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'primereact/button';

import Table from '@/components/table';
import { Column } from '@/components/table/table';
import TitlePane from '@/components/title-pane';
import { ITemplate } from '@/interface/workflow';
import { mock_templates } from "@/mock-data/mock";

export default function Page() {

    const templates = mock_templates;

    const columns: Column<ITemplate>[] = [
        { key: 'id', title: 'ID' },
        { key: 'name', title: 'Name' }
    ]

    return <div className="flex h-full flex-col gap-std items-stretch text-light">
        <TitlePane
            title='Template List'
            postContent={
                <>
                    <Button icon={<FontAwesomeIcon className='mr-[7px]' icon={faAdd} />}
                        severity="success"
                        label='Add New Template'
                        tooltipOptions={{ position: 'left' }}
                        onClick={() => {

                        }}
                    />
                </>}
        />
        <Table className='' data={templates} columns={columns}
            paginator rows={10}
            first={0}
            totalRecords={5}
            onRowClick={() => {
                // 
            }}
        />
    </div>

}
