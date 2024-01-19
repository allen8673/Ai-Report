'use client'
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { map } from 'lodash';
import { Button } from 'primereact/button';
import { confirmDialog } from 'primereact/confirmdialog';
import { Splitter, SplitterPanel } from 'primereact/splitter';
import { useEffect, useState } from 'react';

import { deleteFlow, getFlow, getFlows, updateFlow } from '@/api-helpers/flow-api';
import FlowEditor from '@/components/flow-editor';
import { useGraphRef } from '@/components/graph';
import Modal from '@/components/modal';
import EmptyPane from '@/components/panes/empty';
import TitlePane from '@/components/panes/title';
import Table from '@/components/table';
import { Column } from '@/components/table/table';
import { IFlowNode, IFlow, IFlowBase } from '@/interface/flow';
import { useLayoutContext } from '@/layout/standard-layout/context';

export default function Page() {

    const [templates, setTemplates] = useState<IFlowBase[]>([]);
    const [selection, setSelection] = useState<IFlow>();
    const [editTemp, setEditTemp] = useState<IFlow>();
    const { showMessage } = useLayoutContext();

    const { graphRef } = useGraphRef<IFlowNode, any>();
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
                        severity='info'
                        tooltip="Edit template"
                        tooltipOptions={{ position: 'left' }}
                        icon={<FontAwesomeIcon icon={faPen} />}
                        onClick={async () => {
                            const tmp = await getFlow(row.id)
                            setEditTemp(tmp)
                        }}
                    />
                    <Button
                        className="py-0 px-[0px] h-[40px]"
                        severity='danger'
                        tooltip="Remove template"
                        tooltipOptions={{ position: 'left' }}
                        icon={
                            <FontAwesomeIcon icon={faTrash} />
                        }
                        onClick={() => {
                            confirmDialog({
                                position: 'top',
                                message: `Do you want to remove ${row?.name || 'this template'}?`,
                                header: `Remove Template`,
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
                    />

                </div >
            },

        }
    ];

    const fetchTemplates = async () => {
        const tmps = await getFlows('TEMPLATE');
        setTemplates(tmps)
    }

    useEffect(() => {
        fetchTemplates()
    }, [])

    return <div className="page-std">
        <TitlePane title='Template' />
        <Splitter className='shrink grow' style={{ height: '300px' }} layout="vertical">
            <SplitterPanel className="px-[7px] " size={60}>
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
            <SplitterPanel className="overflow-auto px-[7px]" size={40}>
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
        <EditTemplateModal
            editTemp={editTemp}
            onOk={async (result) => {
                const res = await updateFlow(result);
                if (res.data.status === 'ok') {
                    showMessage({
                        type: 'success',
                        message: res.data.message || 'Success',
                    });
                    setSelection(pre => result.id === pre?.id ? result : pre)
                    setEditTemp(undefined);
                } else {
                    showMessage({
                        type: 'error',
                        message: res.data.message || 'error',
                    });
                }
            }}
            onCancel={() => {
                confirmDialog({
                    position: 'top',
                    message: `Are you sure you want to cancel without saving? You will lose every modification.`,
                    header: `Cancel modify`,
                    icon: 'pi pi-info-circle',
                    acceptClassName: 'p-button-danger',
                    accept: async () => {
                        setEditTemp(undefined)
                    },
                });
            }}
        />
    </div>

}

interface EditTemplateModalProps {
    editTemp?: IFlow;
    onOk: (result: IFlow) => void;
    onCancel: () => void
}

function EditTemplateModal({ editTemp, onOk, onCancel }: EditTemplateModalProps) {

    const { graphRef } = useGraphRef<IFlowNode, any>();

    return <Modal
        className='w-[90%] h-[90%]'
        footerClass="flex justify-end"
        showHeader={false}
        visible={!!editTemp}
        onOk={() => {
            if (!editTemp) return
            const flows: IFlowNode[] = map(graphRef.current?.getNodes() || [], n => ({
                ...n.data, position: n.position
            }));
            const result: IFlow = ({ ...editTemp, flows });
            onOk(result)
        }}
        okLabel='Save'
        onCancel={() => {
            onCancel()
        }}>
        <FlowEditor
            flows={editTemp?.flows || []}
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
            inEdit
            delayRender={500}
        />
    </Modal>
}
