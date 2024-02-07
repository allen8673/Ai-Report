import { map } from "lodash";
import { Button } from "primereact/button";
import { SpeedDial } from "primereact/speeddial";
import { Tooltip } from "primereact/tooltip";
import { useState } from "react";

import List from "../list";
import LoadingPane from "../panes/loading";

import { FlowListContext, useFlowListContext } from "./context";
import { FlowListProps, ListItemProps } from "./flow-list";

import { IFlowBase } from "@/interface/flow";
import { cn } from "@/lib/utils";


export function FlowListItem({ itemkey, item }: ListItemProps) {
    const { selectedFlow, renderMenus } = useFlowListContext();
    const [openMenu, setOpenMenu] = useState<boolean>(false)

    return (
        <div key={itemkey} className={`h-[88px] px-3 py-2 text-light m-1.5
                         border-light border-solid rounded-std 
                         flex items-center
                         ${selectedFlow?.id === item.id ? 'bg-turbo-deep-weak/[.6]' : ''}
                         hover:bg-deep-weak `}>
            <div className="grow shrink flex flex-col overflow-hidden">
                <div className="text-xl ellipsis">{item.name}</div>
                <i className="ellipsis overflow-hidden text-light-weak">{item.id}</i>
            </div>
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
                    className: cn(`bg-deep/[.8] hover:bg-light-weak w-[38px] h-[38px]`, i.className),
                    template: (item, options) => {
                        return (
                            <Button
                                className={cn(options.className, item.className, 'border-none')}
                                icon={item.icon}
                                onClick={e => {
                                    e.stopPropagation();
                                    item.command?.({ originalEvent: e, item })
                                }}
                                tooltip={item.label}
                                tooltipOptions={{ position: 'top' }}
                            />
                        )
                    }
                }))}
            />
        </div>
    )
}

export default function FlowList({ flows, defaultSelectedItem, onAddWF, onItemSelected, renderMenus, loading }: FlowListProps) {

    const [selectedFlow, setSelectedFlow] = useState<IFlowBase | undefined>(defaultSelectedItem);
    const showActBar: boolean = !!onAddWF;

    return (
        <FlowListContext.Provider value={{ selectedFlow, setSelectedFlow, renderMenus }}>
            <Tooltip target=".item-speeddial .p-speeddial-action" position='top' />
            <LoadingPane loading={loading} className="!rounded-std border-light-weak/[.2]" title="Fetching data...">
                <div className={`
                        py-[22px] px-[18px] w-full h-full overflow-hidden
                        bg-deep rounded-std border-solid border-light-weak/[.2]
                        flex flex-col items-end`}
                >
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
                                itemkey={`flow-item-${idx}`}
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
            </LoadingPane>
        </FlowListContext.Provider >
    )
}