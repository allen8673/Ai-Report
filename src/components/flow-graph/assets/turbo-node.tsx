import { faCloud } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from "react";
import { Handle, NodeProps, Position } from "reactflow";

import { flowInfoMap } from "../configuration";

import { IFlow } from '@/interface/workflow';

function TurboNodeInstance(elm: NodeProps<IFlow>) {
    const { id, data, isConnectable, } = elm;
    const { running } = data || {}
    const { icon } = flowInfoMap[data.type] || {}
    let status_color = '';
    switch (data.status) {
        case 'success': status_color = 'bg-success'; break;
        case 'failure': status_color = 'bg-failure'; break;
        case 'warning': status_color = 'bg-warning'; break;
        default: status_color = ''; break;
    }

    return (
        <>
            <div className="cloud gradient text-light-weak hover:text-light cursor-default">
                <div className='bg-deep-weak flex-center'>
                    <FontAwesomeIcon className='h-[16px] w-[16px] flex-center ' icon={faCloud} />
                </div>
            </div>
            <div className={`middle wrapper gradient rounded-std-sm flex-center flex-col gap-[5px] ${running ? "running" : ''}`} >
                <div className={`inner rounded-std-sm bg-deep-weak`}>
                    <div className={`py-[16px] px-[20px] ${status_color}`}>
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
                isConnectable={isConnectable}
            />
            <Handle
                className='turbo-handle'
                type="source"
                position={Position.Right}
                id={`src-${id}`}
                isConnectable={isConnectable}
            />
        </>
    );
}
const TurboNode = React.memo(TurboNodeInstance)
export default TurboNode