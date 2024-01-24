import { Button } from "primereact/button";

import { IFlow, IFlowBase } from "@/interface/flow";

export interface ListItemProps {
    key: string;
    flowData?: IFlow;
    itemData: IFlowBase;
}

export function ListItem({ key, flowData, itemData, }: ListItemProps) {



    return (
        <div key={key} className={`h-[88px] px-3 py-2 text-light m-1.5
                         border-light border-solid rounded-std 
                         flex items-center
                         ${flowData?.id === itemData.id ? 'bg-turbo-deep-weak/[.6]' : ''}
                         hover:bg-deep-weak `}>
            <div className="grow shrink flex flex-col overflow-hidden">
                <div className="text-xl ellipsis">{itemData.name}</div>
                <i className="ellipsis overflow-hidden text-light-weak">{itemData.id}</i>
            </div>
            <Button
                className={`border-4  min-w-[38px] min-h-[38px]`}
                icon='pi pi-ellipsis-h'
                outlined
                rounded
                severity='secondary'
            />
        </div>
    )
}