import { map } from "lodash";
import { Button } from "primereact/button";
import { SpeedDial } from "primereact/speeddial";
import { Tooltip } from "primereact/tooltip";
import { useState } from "react";

import List from "../list";

import { FlowListContext, useFlowListContext } from "./context";
import { FlowListProps, ListItemProps } from "./flow-list";

import { IFlowBase } from "@/interface/flow";
import { cn } from "@/lib/utils";


export function FlowListItem({ key, item }: ListItemProps) {
    const { selectedFlow, renderMenus } = useFlowListContext();
    const [openMenu, setOpenMenu] = useState<boolean>(false)

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
            <div role='presentation' onClick={e => e.stopPropagation()}>
                <SpeedDial
                    direction='left'
                    className={`item-speeddial flex-h-center right-5 top-8 ${openMenu ? 'p-speeddial-opened' : ''}`}
                    onMouseLeave={() => setOpenMenu(false)}
                    buttonClassName="w-[38px] h-[38px] border-light-weak border-2 bg-deep-weak"
                    buttonTemplate={opt => (
                        <Button
                            className={opt.className}
                            onMouseEnter={() => setOpenMenu(true)}
                            icon={'pi pi-ellipsis-h'}
                        />)}
                    model={map(renderMenus?.(item), i => ({
                        ...i,
                        className: cn(`bg-deep/[.8] hover:bg-light-weak w-[38px] h-[38px]`, i.className)
                    }))}
                />
            </div>

        </div>
    )
}

export default function FlowList({ flows, defaultSelectedItem, onAddWF, onItemSelected, renderMenus }: FlowListProps) {

    const [selectedFlow, setSelectedFlow] = useState<IFlowBase | undefined>(defaultSelectedItem);
    const showActBar: boolean = !!onAddWF;

    return (
        <FlowListContext.Provider value={{ selectedFlow, setSelectedFlow, renderMenus }}>
            <Tooltip target=".item-speeddial .p-speeddial-action" position='top' />
            <div className="flex flex-col py-[22px] px-[18px] w-full h-full overflow-hidden items-end bg-deep rounded-std">
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