import { IconDefinition, faCheck, faCloud, faExclamation, faGear, faQuestion, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { ReactNode } from "react";
import { Handle, NodeProps, Position } from "reactflow";

import { flowInfoMap } from "../configuration";
import { useFlowGrapContext } from '../context';

import { FlowStatus, IFlow } from '@/interface/workflow';

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

function TurboNodeInstance(elm: NodeProps<IFlow>) {
    const { id, data, } = elm;
    const { running } = data || {}
    const { icon } = flowInfoMap[data.type] || {}
    const { inEdit, clickOnSetting } = useFlowGrapContext();

    return (
        <>
            {inEdit ?
                <div className={`cloud icon gradient ${!!data.promt || !!data.file ? 'text-light' : 'text-light-weak'} hover:text-light cursor-default`}>
                    <div className='bg-deep-weak flex-center'>
                        <FontAwesomeIcon
                            className='h-[16px] w-[16px] flex-center '
                            icon={faGear}
                            onClick={() => { clickOnSetting?.(data) }}
                        />
                    </div>
                </div> :
                <div className={`cloud icon gradient ${!!data.promt || !!data.file ? 'text-light' : 'text-light-weak'}`}>
                    <div className='bg-deep-weak flex-center'>
                        <FontAwesomeIcon
                            className='h-[16px] w-[16px] flex-center '
                            icon={faCloud}
                        />
                    </div>
                </div>
            }
            {getStatusIcon(data.status)}
            <div className={`middle wrapper gradient rounded-std-sm flex-center flex-col gap-[5px] ${running ? "running" : ''}`} >
                <div className={`inner rounded-std-sm bg-deep-weak`}>
                    <div className={`py-[16px] px-[20px]`}>
                        <div className={`flex rounded-std-sm text-light`}>
                            <FontAwesomeIcon className='h-[20px] w-[20px] mr-[8px] mt-[2px]' icon={icon} color={'white'} />
                            <div>
                                <div className="text-[20px] mb-[2px] leading-1">{data.name}</div>
                                <div className="text-[16px] text-light-weak">{data.type}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
            <Handle
                className='turbo-handle'
                type="target"
                position={Position.Left}
                id={`tgt-${id}`}
                onConnect={(): void => {
                    alert('haha')
                }}
                isConnectable={inEdit}
            />
            <Handle
                className='turbo-handle'
                type="source"
                position={Position.Right}
                id={`src-${id}`}
                isConnectable={inEdit}
            />
        </>
    );
}
const TurboNode = React.memo(TurboNodeInstance)
export default TurboNode