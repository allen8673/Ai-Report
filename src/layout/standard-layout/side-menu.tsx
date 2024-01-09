'use client'
import { faFire, faQuestion, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import RouterInfo from '@settings/router';
import _ from 'lodash';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from 'primereact/button';
import { MenuItem } from 'primereact/menuitem';
import { TieredMenu } from 'primereact/tieredmenu';
import { Tooltip } from 'primereact/tooltip';
import { useRef } from 'react';

import { userSignOut } from '@/lib/auth';
import { getFullUrl } from '@/lib/router';

export default function SideMenu({ bgMainview }: { bgMainview?: boolean }) {
    const pathname = usePathname();
    const userMenu = useRef<TieredMenu>(null);
    const navigations = _.filter(RouterInfo, ['isNavigation', true]);
    const userItems: MenuItem[] = [
        {
            label: 'Profiles',
            icon: 'pi pi-fw pi-user',
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
            <div className={`
                bg-deep rounded-std w-[60px] min-w-[60px] py-std
                flex flex-col items-center gap-std z-1
                ${bgMainview ? "shadow-[0px_0px_15px_-3px] shadow-light-weak" : ""}
                `}>
                <FontAwesomeIcon className='text-[30px]' icon={faFire} color={'white'} />
                <div className='flex flex-col grow shrink gap-[6px]'>
                    {_.map(navigations, n => {
                        const url = getFullUrl(n);
                        const onselected = (pathname === '/' && n === RouterInfo.HOME) || (!!n.folder && _.includes(pathname, n.folder))
                        return (
                            <Link
                                key={n.title}
                                className={`link-btn flex-center p-[7px] ${onselected ? "text-light border-solid rounded-std-sm rounded-light" : 'text-light-weak'}`}
                                href={url || "/"}
                                data-pr-tooltip={n.title}
                            >
                                <FontAwesomeIcon className={`flex-center text-[20px]  hover:text-light`} icon={n.icon || faQuestion} />
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
                        style={{ transform: 'translate(40px ,34px)' }}
                    />
                    <Button
                        unstyled
                        icon={<FontAwesomeIcon className='text-[30px]' icon={faUser} color={'white'} />}
                        className={`
                        flex-center p-2 bg-inherit border-none rounded-std-sm
                        hover:bg-deep-weak [&>span]:w-0
                        `}
                        onClick={(e) => {
                            userMenu.current?.toggle(e)
                        }}
                    />
                </div>
            </div>
        </>
    )
}
