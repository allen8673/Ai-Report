import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from "react";
import { Handle, NodeProps, Position } from "reactflow";

import { flowInfoMap } from "../mapper";
import { IReportItem } from "../type";

function TurboNodeInstance(elm: NodeProps<IReportItem>) {
    const { id, data, isConnectable } = elm;
    const { icon } = flowInfoMap[data.type] || {}

    return (
        <>
            <div className="middle wrapper gradient std-sm-rounded flex-center flex-col gap-[5px] " >
                <div className="inner std-sm-rounded bg-std-deep-weak">
                    <div className="body std-sm-rounded text-std-light">
                        <FontAwesomeIcon className='icon' icon={icon} color={'white'} />
                        <div>
                            <div className="title">{data.name}</div>
                            <div className="subline">{data.type}</div>
                        </div>
                    </div>
                </div>
            </div >

            <Handle
                className='turbo-handle'
                type="target"
                position={Position.Left}
                id={`tgt-${id}`}
                onConnect={(params): void => {
                    alert('haha')
                }}
                isConnectable={isConnectable}
            ><div className='123' /></Handle>
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