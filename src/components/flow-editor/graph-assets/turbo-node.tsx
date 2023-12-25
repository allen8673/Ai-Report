import { IconDefinition, faCheck, faCloud, faExclamation, faQuestion, faWarning, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { confirmDialog } from 'primereact/confirmdialog';
import { Tooltip } from 'primereact/tooltip';
import React, { ReactNode } from "react";
import { Handle, NodeProps, Position } from "reactflow";

import { flowInfoMap } from "../configuration";
import { useFlowGrapContext } from '../context';

import { FlowStatus, IFlowNode } from '@/interface/flow';

const getStatusIcon = (status?: FlowStatus): ReactNode => {
    if (!status || status === 'none') return <></>

    let status_color = 'bg-deep-weak';
    let icon: IconDefinition = faQuestion

    switch (status) {
        case 'success':
            status_color = 'bg-success';
            icon = faCheck
            break;
        case 'failure':
            status_color = 'bg-failure';
            icon = faXmark
            break;
        case 'warning':
            status_color = 'bg-warning';
            icon = faExclamation
            break;
    }

    return (
        <div className={`status icon gradient text-light `}>
            <div className={` ${status_color} flex-center`}>
                <FontAwesomeIcon
                    className={`h-[16px] w-[16px] flex-center ${status_color}`}
                    icon={icon}
                />
            </div>
        </div>
    )
}

function TurboNodeInstance(elm: NodeProps<IFlowNode>) {
    const { id, data, } = elm;
    const { running, workflowstatus } = data || {}
    const { nodeType, icon, nodeName, editable } = flowInfoMap[data.type] || {}
    const { inEdit, clickOnSetting, flowNameMapper, graphRef } = useFlowGrapContext();
    const iconHighlight = !!data.prompt || !!data.report
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
            {/* <Tooltip target={'.tip-icon'} mouseTrack position='left' /> */}
            <Tooltip target={'.wf-name'} mouseTrack position='top' />
            {!!editable &&
                <div className={`tip-icon icon gradient ${clickable ? "cursor-pointer" : ''}
                    ${iconHighlight ? 'text-light' : 'text-light-weak'} 
                    ${(inEdit && deletable) ? `hover:text-light ` : ''}
                    `}>
                    <div className='bg-deep-weak flex-center'
                        role='presentation'
                        onClick={removeNode}
                    >
                        <FontAwesomeIcon
                            className='h-[16px] w-[16px] flex-center '
                            icon={inEdit ? faXmark : faCloud}
                        />
                    </div>
                </div >}
            {getStatusIcon(data.status)}
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
                                <FontAwesomeIcon className={`font-medium text-5xl text-warning-light`} icon={faWarning} />
                                {/* <i className="pi pi-exclamation-triangle font-medium text-5xl text-warning-light" /> */}
                            </div>
                        }
                        <div className={`flex items-center rounded-std-sm text-light`}>
                            <FontAwesomeIcon className='text-[30px] mr-[8px] mt-[2px]' icon={icon} color={'white'} />
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