'use client'
import { faAdd, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import _ from 'lodash';
import { Button } from 'primereact/button';
import { confirmDialog } from 'primereact/confirmdialog';
import { Splitter, SplitterPanel } from 'primereact/splitter';
import { useEffect, useState } from 'react';

import FlowGraph from '@/components/flow-editor';
import { useGraphRef } from '@/components/graph/helper';
import Table from '@/components/table';
import { Column } from '@/components/table/table';
import TitlePane from '@/components/title-pane';
import { IFlow, ITemplate } from '@/interface/workflow';
import { mock_templates } from "@/mock-data/mock";

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
                            accept: () => {
                                // TODO: Call API to delete template
                                _.remove(mock_templates, ['id', row?.id || '']);
                                setTemplates([...mock_templates]);
                                setSelection(pre => pre?.id === row.id ? undefined : pre)
                            },
                        });
                    }}
                    icon={faTrash} />
            ),
            style: { width: 100, padding: '0px 7px' }
        }
    ];

    useEffect(() => {
        setTemplates(mock_templates)
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
                    onSelectionChange={e => {
                        setSelection(e.value);
                    }}
                    selection={selection}
                />
            </SplitterPanel>
        </Splitter>

    </div>

}
