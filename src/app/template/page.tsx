'use client'
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { confirmDialog } from 'primereact/confirmdialog';
import { Splitter, SplitterPanel } from 'primereact/splitter';
import { useEffect, useState } from 'react';

import { deleteFlow, getFlow, getFlows } from '@/api-helpers/flow-api';
import FlowEditor from '@/components/flow-editor';
import { useGraphRef } from '@/components/graph/helper';
import EmptyPane from '@/components/panes/empty';
import TitlePane from '@/components/panes/title';
import Table from '@/components/table';
import { Column } from '@/components/table/table';
import { IFlowNode, IFlow, IFlowBase } from '@/interface/flow';

export default function Page() {

    const [templates, setTemplates] = useState<IFlowBase[]>([]);
    const [selection, setSelection] = useState<IFlow>();

    const { graphRef } = useGraphRef<IFlowNode, any>();
    const columns: Column<IFlowBase>[] = [
        { key: 'id', title: 'ID', style: { width: '25%' } },
        { key: 'name', title: 'Name' },
        {
            format: (row) => (
                <FontAwesomeIcon
                    className='w-[19px] h-[19px] p-[9px] border-solid border-[1px] border-light rounded-std bg-light-weak'
                    onClick={async (e) => {
                        e.stopPropagation();
                        confirmDialog({
                            position: 'top',
                            message: `Do you want to delete ${row?.name || 'this template'}?`,
                            header: `Delete Template`,
                            icon: 'pi pi-info-circle',
                            acceptClassName: 'p-button-danger',
                            accept: async () => {
                                const rsp = await deleteFlow(row?.id);
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
        const tmps = await getFlows('TEMPLATE');
        setTemplates(tmps)
    }

    useEffect(() => {
        fetchTemplates()
    }, [])

    return <div className="flex h-full flex-col gap-std items-stretch text-light">
        <TitlePane
            title='Template List'
            postContent={
                <>

                </>}
        />
        <Splitter className='h-full' style={{ height: '300px' }} layout="vertical">
            <SplitterPanel className="px-[7px] " size={40}>
                {selection?.flows ? <FlowEditor
                    flows={selection.flows}
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
                /> : <EmptyPane icon={faPaperPlane} title='Select a template to show the graph' />}
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
                        const tmp = await getFlow(e.value.id)
                        setSelection(tmp);
                    }}
                    selection={selection}
                />
            </SplitterPanel>
        </Splitter>

    </div>

}
