'use client'
import RouterInfo from '@settings/router';
import _ from 'lodash';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Divider } from 'primereact/divider';
import { MenuItem } from 'primereact/menuitem';
import { TieredMenu } from 'primereact/tieredmenu';
import { Tooltip } from 'primereact/tooltip';
import { useRef } from 'react';

import { userSignOut } from '@/lib/auth';
import { getFullUrl } from '@/lib/router';
import { cn } from '@/lib/utils';

export default function SideMenu({ bgMainview }: { bgMainview?: boolean }) {
    const pathname = usePathname();
    const userMenu = useRef<TieredMenu>(null);
    const navigations = _.filter(RouterInfo, ['isNavigation', true]);
    const userItems: MenuItem[] = [
        {
            label: 'Profiles',
            icon: 'pi pi-fw pi-user-edit',
        },
        {
            separator: true
        },
        {
            label: 'Logout',
            icon: 'pi pi-fw pi-power-off',
            command: () => {
                userSignOut()
            }
        },
    ];

    return (
        <>
            <Tooltip target={'.link-btn'} position='right' />
            <div className={
                cn(`
                    bg-deep rounded-std w-[60px] min-w-[60px] py-std
                    flex flex-col items-center gap-std-sm z-1`,
                    bgMainview ? "shadow-[0px_0px_15px_-3px] shadow-light-weak" : ""
                )}>
                <i className={cn('pi pi-bars', '!text-4xl', 'text-[#fff]')} />
                <Divider align="center" className='my-1 w-9' />
                <div className='flex flex-col grow shrink gap-[6px]'>
                    {_.map(navigations, n => {
                        const url = getFullUrl(n);
                        const onselected = (pathname === '/' && n === RouterInfo.HOME) || (!!n.folder && _.includes(pathname, n.folder))
                        return (
                            <Link
                                key={n.title}
                                className={
                                    cn(`link-btn flex-center px-1 py-1 no-underline`,
                                        onselected ? "text-light" : 'text-light-weak')
                                }
                                href={url || "/"}
                                data-pr-tooltip={n.title}

                            >
                                <i className={cn(`pi ${n.icon}`, onselected ? '!text-3xl' : '!text-xl')} />
                            </Link>
                        )
                    })}
                </div>
                <div className="flex justify-content-center">
                    <TieredMenu
                        model={userItems}
                        popup
                        ref={userMenu}
                        breakpoint="176px"
                        style={{ transform: 'translate(60px ,40px)' }}
                    />
                    <i className={`
                        pi pi-user text-[#fff] !text-4xl p-2 rounded-std-sm 
                        cursor-pointer
                        hover:bg-deep-weak 
                    `}
                        role='presentation'
                        onClick={e => userMenu.current?.toggle(e)}
                    />
                </div>
            </div>
        </>
    )
}
