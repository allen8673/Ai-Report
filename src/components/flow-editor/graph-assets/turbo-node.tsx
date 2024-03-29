import { confirmDialog } from 'primereact/confirmdialog';
import { Tooltip } from 'primereact/tooltip';
import React, { ReactNode } from "react";
import { Handle, NodeProps, Position } from "reactflow";

import { flowInfoMap } from "../configuration";
import { useFlowGrapContext } from '../context';

import { FlowStatus, IFlowNode } from '@/interface/flow';
import { downloadString } from '@/lib/utils';

const getStatusIcon = (status?: FlowStatus): ReactNode => {
    if (!status || status === 'none') return <></>

    let status_color = 'bg-deep-weak';
    let icon: string = 'pi-question';

    switch (status) {
        case 'wait':
            icon = 'pi pi-spin pi-spinner'
            break;
        case 'ongoing':
            status_color = 'bg-success';
            icon = 'pi-spin pi-sync'
            break;
        case 'done':
            status_color = 'bg-success';
            icon = 'pi-check-circle'
            break;
        case 'failure':
            status_color = 'bg-failure';
            icon = 'pi-times-circle'
            break;
        case 'warning':
            status_color = 'bg-warning';
            icon = 'pi-exclamation-circle'
            break;

    }

    return (
        <div className={`status icon gradient text-light `}>
            <div className={` ${status_color} flex-center`}>
                <i className={`pi ${icon}`} />
            </div>
        </div>
    )
}

function TurboNodeInstance(elm: NodeProps<IFlowNode>) {
    const { id, data } = elm;
    const { running, workflowstatus, reportData } = data || {}
    const { nodeType, icon, nodeName, editable } = flowInfoMap[data.type] || {}
    const { inEdit, clickOnSetting, flowNameMapper, graphRef } = useFlowGrapContext();
    const iconHighlight = !!data.prompt;
    const deletable = editable
    const clickable = inEdit;

    const warning = workflowstatus === 'disable'

    const removeNode = () => {
        if (!inEdit) return;
        confirmDialog({
            position: 'top',
            message: `Do you want to remove ${data?.name || 'this node'}?`,
            header: `Remove Node`,
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger',
            accept: () => {
                graphRef?.current?.removeNode(id)
            },
        });
    }

    return (
        <>
            <Tooltip target={'.wf-name'} mouseTrack position='top' />
            {!!editable && inEdit &&
                <div className={`tip-icon icon gradient ${clickable ? "cursor-pointer" : ''}
                    ${iconHighlight ? 'text-light' : 'text-light-weak'} 
                    ${(inEdit && deletable) ? `hover:text-light ` : ''}
                    `}>
                    <div className='bg-deep-weak flex-center'
                        role='presentation'
                        onClick={removeNode}
                    >
                        <i className='pi pi-times' />
                    </div>
                </div >}
            {getStatusIcon(data.status)}
            {!!reportData && (
                <div className={`status icon gradient text-light cursor-pointer`}
                    role='presentation'
                    onClick={(e) => {
                        e.stopPropagation();
                        downloadString(reportData, data.name || id);
                    }}
                >
                    <div className={`bg-light-weak  flex-center`}>
                        <i className={`pi pi-arrow-down`} />
                    </div>
                </div>)
            }
            <div className={`wrapper gradient
            overflow-hidden
            p-[1px]
            relative
            rounded-std-sm 
            flex-center 
            flex-col 
            gap-[5px]
            ${running ? "running" : ''}`} >
                <div role='presentation' className={`inner relative flex rounded-std-sm bg-deep-weak`}
                    onClick={() => { clickOnSetting?.(data) }}>
                    <div className={`py-[16px] px-[20px] min-w-[190px] max-w-[260px]`}>
                        {warning &&
                            <div className={`
                            absolute inset-0 px-[12px] bg-warning-deep opacity-30
                            flex items-center flex-row-reverse 
                            `}>
                                <i className="pi pi-exclamation-triangle font-medium text-5xl text-warning-light" />
                            </div>
                        }
                        <div className={`flex items-center rounded-std-sm text-light`}>
                            <i className={`pi ${icon} text-3xl mr-[8px]`} />
                            <div className='grow shrink overflow-hidden'>
                                <div className="text-[20px] mb-[2px] leading-1 ellipsis wf-name"
                                    data-pr-tooltip={data.name}
                                >
                                    {(data.type === 'Workflow' ? flowNameMapper?.[data.workflowid || ''] : (nodeName || data.name))
                                        || <span className='italic'>N / A</span>}
                                </div>
                                <div className="text-[16px] text-light-weak">{data.type}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
            {nodeType !== 'start' && <Handle
                className='turbo-handle'
                type="target"
                position={Position.Left}
                id={`tgt-${id}`}
                onConnect={(): void => {
                    // 
                }}
                isConnectable={inEdit}
            />}
            {nodeType !== 'end' && <Handle
                className='turbo-handle'
                type="source"
                position={Position.Right}
                id={`src-${id}`}
                isConnectable={inEdit}
            />}
        </>
    );
}
const TurboNode = React.memo(TurboNodeInstance)
export default TurboNode