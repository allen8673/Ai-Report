'use client'
import { map } from 'lodash';
import { Button } from 'primereact/button';
import { confirmDialog } from 'primereact/confirmdialog';
import { MenuItem } from 'primereact/menuitem';
import { Splitter, SplitterPanel } from 'primereact/splitter';
import { useEffect, useState } from 'react';

import { deleteFlow, getFlow, getFlows, updateFlow } from '@/api-helpers/flow-api';
import FlowEditor from '@/components/flow-editor';
import FlowList from '@/components/flow-list';
import { useGraphRef } from '@/components/graph';
import Modal from '@/components/modal';
import EmptyPane from '@/components/panes/empty';
import TitlePane from '@/components/panes/title';
import { IFlowNode, IFlow, IFlowBase } from '@/interface/flow';
import { useLayoutContext } from '@/layout/standard-layout/context';

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

interface TemplatePreviewerProps {
    template?: IFlow;
    onClickEdit?: (tmp?: IFlow) => void;
    onDelete?: (tmp?: IFlow) => void
}

function TemplatePreviewer({ template, onClickEdit, onDelete }: TemplatePreviewerProps) {
    const { graphRef } = useGraphRef<IFlowNode, any>();

    return (
        <EmptyPane icon='pi-send' title='Select a template to show the graph' isEmpty={!template?.flows}>
            <FlowEditor
                flows={template?.flows || []}
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
                actionBarContent={
                    <div
                        className="flex-h-center gap-[7px] justify-end w-full"
                        role='presentation'
                        onClick={(e) => e.stopPropagation()}>
                        <Button
                            className="py-0 px-[0px] h-[40px]"
                            icon='pi pi-trash'
                            severity='danger'
                            tooltip="Remove Template"
                            tooltipOptions={{ position: 'left' }}
                            onClick={() => {
                                confirmDialog({
                                    position: 'top',
                                    message: `Do you want to remove ${template?.name || 'this template'}?`,
                                    header: `Remove Template`,
                                    icon: 'pi pi-info-circle',
                                    acceptClassName: 'p-button-danger',
                                    accept: () => {
                                        onDelete?.(template)
                                    }
                                });
                            }}
                        />
                        <Button
                            className="h-[40px]"
                            icon='pi pi-pencil'
                            label="Edit template"
                            tooltipOptions={{ position: 'left' }}
                            onClick={() => onClickEdit?.(template)}
                        />
                    </div>
                }
                showActionBar
            />
        </EmptyPane>
    )

}

export default function Page() {

    const [templates, setTemplates] = useState<IFlowBase[]>([]);
    const [template, setTemplate] = useState<IFlow>();
    const [editTemp, setEditTemp] = useState<IFlow>();
    const { showMessage } = useLayoutContext();

    const onDeleteTemplate = async (tmpId: string) => {
        const rsp = await deleteFlow(tmpId);
        if (rsp.data.status === 'failure') return;
        await fetchTemplates();
        setTemplate(pre => pre?.id === tmpId ? undefined : pre)
    }

    const renderMenus = (item: IFlowBase): MenuItem[] => [
        {
            label: 'Edit Workflow',
            icon: 'pi pi-pencil',
            className: 'bg-primary hover:bg-primary-600',
            command: async () => {
                const tmp = await getFlow(item.id)
                setEditTemp(tmp);
            }
        },
        {
            label: 'Remove Template',
            icon: 'pi pi-trash',
            className: 'bg-danger hover:bg-danger-deep',
            command: () => {
                confirmDialog({
                    position: 'top',
                    message: `Do you want to remove ${item?.name || 'this template'}?`,
                    header: `Remove Template`,
                    icon: 'pi pi-info-circle',
                    acceptClassName: 'p-button-danger',
                    accept: async () => {
                        await onDeleteTemplate(item.id);
                    }
                });
            }
        },
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
        <Splitter className='shrink grow' style={{ height: '30px' }} layout='horizontal'>
            <SplitterPanel className="px-[7px]" size={80}>
                <TemplatePreviewer
                    template={template}
                    onClickEdit={async (tmp) => {
                        setEditTemp(tmp)
                    }}
                    onDelete={async (tmp) => {
                        if (!tmp) return;
                        await onDeleteTemplate(tmp.id)
                    }}
                />
            </SplitterPanel>
            <SplitterPanel className="overflow-auto px-[7px]" size={20}>
                <FlowList
                    defaultSelectedItem={template}
                    flows={templates}
                    onItemSelected={async (item) => {
                        const tmp = await getFlow(item.id)
                        setTemplate(tmp);
                    }}
                    renderMenus={renderMenus}
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
                    setTemplate(pre => result.id === pre?.id ? result : pre)
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


