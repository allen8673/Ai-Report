'use client'
import { faAdd, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios'
import { Button } from 'primereact/button';
import { confirmDialog } from 'primereact/confirmdialog';
import { Splitter, SplitterPanel } from 'primereact/splitter';
import { useEffect, useState } from 'react';

import FlowGraph from '@/components/flow-editor';
import { useGraphRef } from '@/components/graph/helper';
import Table from '@/components/table';
import { Column } from '@/components/table/table';
import TitlePane from '@/components/title-pane';
import { ApiResult } from '@/interface/api';
import { IFlow, ITemplate } from '@/interface/workflow';

export default function Page() {

    const [templates, setTemplates] = useState<ITemplate[]>([]);
    const [selection, setSelection] = useState<ITemplate>();

    const { graphRef } = useGraphRef<IFlow, any>();
    const columns: Column<ITemplate>[] = [
        { key: 'id', title: 'ID', style: { width: '25%' } },
        { key: 'name', title: 'Name' },
        {
            format: (row) => (
                <FontAwesomeIcon
                    className='w-[19px] h-[19px] p-[9px] border-solid border-[1px] border-light rounded-std bg-light-weak'
                    onClick={async (e) => {
                        e.stopPropagation();
                        confirmDialog({
                            message: `Do you want to delete ${row?.name || 'this template'}?`,
                            header: `Delete Workflow`,
                            icon: 'pi pi-info-circle',
                            acceptClassName: 'p-button-danger',
                            accept: async () => {
                                // TODO: Call API to delete template
                                const rsp = await axios.delete<ApiResult>(`${(process.env.NEXT_PUBLIC_API_HOST || '')}${process.env.NEXT_PUBLIC_TEMPLATE_API}?id=${row?.id || ''}`,);
                                if (rsp.data.status === 'failure') return;
                                await fetchTemplates();
                                setSelection(pre => pre?.id === row.id ? undefined : pre)

                            },
                        });
                    }}
                    icon={faTrash} />
            ),
            style: { width: 100, padding: '0px 7px' }
        }
    ];

    const fetchTemplates = async () => {
        const rsp = await axios.get(`${(process.env.NEXT_PUBLIC_API_HOST || '')}${process.env.NEXT_PUBLIC_TEMPLATE_API}`);
        setTemplates(rsp.data)
    }

    useEffect(() => {
        fetchTemplates()
    }, [])

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
                            //    
                        }}
                    />
                </>}
        />
        <Splitter className='h-full' style={{ height: '300px' }} layout="vertical">
            <SplitterPanel className="px-[7px] " size={40}>
                <FlowGraph
                    className="rounded-std bg-deep"
                    flows={selection?.flows || []}
                    graphRef={graphRef}
                    hideMiniMap
                    hideCtrls
                    fitView
                    fitViewOptions={{ duration: 1000 }}
                    onNodesChange={(changes) => {
                        if (changes.length > 1) {
                            graphRef.current.reactFlowInstance?.fitView({ duration: 500 })
                        }
                    }}
                />
            </SplitterPanel>
            <SplitterPanel className="overflow-auto px-[7px]" size={60}>
                <Table className='h-full w-full'
                    data={templates}
                    columns={columns}
                    paginator
                    rows={10}
                    first={0}
                    totalRecords={5}
                    onSelectionChange={async e => {
                        const rsp = await axios.get(`${(process.env.NEXT_PUBLIC_API_HOST || '')}${process.env.NEXT_PUBLIC_TEMPLATE_API}?id=${e.value.id}`)
                        setSelection(rsp.data);
                    }}
                    selection={selection}
                />
            </SplitterPanel>
        </Splitter>

    </div>

}
