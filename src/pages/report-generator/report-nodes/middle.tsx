import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from "react";
import { Handle, NodeProps, Position } from "reactflow";

import { iconMap } from "../mapper";
import { IReportItem } from "../type";

function Middle(elm: NodeProps<IReportItem>) {
    const { id, data, isConnectable } = elm;
    const { color, bgColor, icon } = iconMap[data.type]

    return (
        <div className='flex-center flex-col gap-[5px]'>
            <Handle
                type="target"
                position={Position.Left}
                style={{ background: '#555', top: 56 }}
                id={`tgt-${id}`}
                onConnect={(params): void => {
                    alert('haha')
                }}
                isConnectable={isConnectable}
            />
            <Handle
                type="source"
                position={Position.Right}
                id={`src-${id}`}
                style={{ background: '#555', top: 56 }}
                isConnectable={isConnectable}
            />
            <div className={`p-[21px] flex-center rounded-[12px] ${bgColor}`} >
                <FontAwesomeIcon className='h-[70px] w-[70px]' icon={icon} color={'white'} />
                {/* {data.name} */}
            </div>
            <span className='std-border bg-[#696969] text-sm text-[#ffffff] px-[7px] py-[3px] '>{data.name}</span>
        </div>
    );
}
const MiddleNode = React.memo(Middle)
export default MiddleNode