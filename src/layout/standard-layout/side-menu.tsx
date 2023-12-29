'use client'
import { faFire, faQuestion, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import RouterInfo from '@settings/router';
import _ from 'lodash';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';

import { userSignOut } from '@/lib/actions';
import { getFullUrl } from '@/lib/router';

export default function SideMenu() {
    const pathname = usePathname();
    const navigations = _.filter(RouterInfo, ['isNavigation', true]);

    return (
        <>
            <Tooltip target={'.link-btn'} position='right' />
            <div className={`bg-deep rounded-std w-[60px] min-w-[60px] py-std flex flex-col items-center gap-std`}>
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
                <Button
                    unstyled
                    icon={<FontAwesomeIcon className='text-[30px]'
                        icon={faUser} color={'white'}
                        onClick={() => {
                            userSignOut()
                        }} />}
                    className="bg-inherit border-none"
                />
            </div>
        </>
    )
}