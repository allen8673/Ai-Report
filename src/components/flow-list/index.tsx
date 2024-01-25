import { Button } from "primereact/button";
import { useState } from "react";

import List from "../list";

import { FlowListContext, useFlowListContext } from "./context";
import { FlowListProps, ListItemProps } from "./flow-list";

import { IFlowBase } from "@/interface/flow";

export function FlowListItem({ key, item, }: ListItemProps) {
    const { selectedFlow } = useFlowListContext();
    return (
        <div key={key} className={`h-[88px] px-3 py-2 text-light m-1.5
                         border-light border-solid rounded-std 
                         flex items-center
                         ${selectedFlow?.id === item.id ? 'bg-turbo-deep-weak/[.6]' : ''}
                         hover:bg-deep-weak `}>
            <div className="grow shrink flex flex-col overflow-hidden">
                <div className="text-xl ellipsis">{item.name}</div>
                <i className="ellipsis overflow-hidden text-light-weak">{item.id}</i>
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

export default function FlowList({ flows, defaultSelectedItem, onAddWF, onItemSelected }: FlowListProps) {

    const [selectedFlow, setSelectedFlow] = useState<IFlowBase | undefined>(defaultSelectedItem);
    const showActBar: boolean = !!onAddWF;

    return (
        <FlowListContext.Provider value={{ selectedFlow, setSelectedFlow }}>
            <div className="flex flex-col py-[22px] px-[18px] w-full overflow-hidden items-end bg-deep rounded-std">
                {showActBar &&
                    <div className="act-bar justify-end w-full py-2">
                        {!!onAddWF && <Button
                            className="ellipsis"
                            icon='pi pi-plus'
                            severity="success"
                            label='Add New Workflow'
                            tooltipOptions={{ position: 'left' }}
                            onClick={onAddWF}
                        />}
                    </div>
                }
                <List
                    className="grow shrink w-full mt-1"
                    data={flows}
                    renderItem={(item, idx) => (
                        <FlowListItem
                            key={`flow-item-${idx}`}
                            item={item}
                        />
                    )}
                    onItemClick={(item) => {
                        setSelectedFlow(() => {
                            onItemSelected?.(item);
                            return item;
                        });
                    }} />
            </div>
        </FlowListContext.Provider>
    )
}