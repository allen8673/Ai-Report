'use client'
import { faFire, faQuestion, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import _ from 'lodash';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { getFullUrl } from '@/lib/router-helper';
import RouterInfo from '@/settings/router-setting';

export default function SideMenu() {
    const pathname = usePathname()
    const navigations = _.filter(RouterInfo, ['isNavigation', true])
    return <div className={`
    bg-deep rounded-std
    w-[60px] min-w-[60px] py-std
    flex flex-col items-center gap-std`}>
        <FontAwesomeIcon className='text-[30px]' icon={faFire} color={'white'} />
        <div className='flex flex-col grow shrink gap-[6px]'>
            {_.map(navigations, n => {
                const url = getFullUrl(n);
                const onselected = (pathname === '/' && n === RouterInfo.HOME) || (!!n.folder && _.includes(pathname, n.folder))
                return (
                    <Link key={n.title} className={`flex-center p-[7px] ${onselected ? "text-light border-solid rounded-std-sm rounded-light" : 'text-light-weak'}`} href={url || "/"}>
                        <FontAwesomeIcon className={`flex-center text-[20px]  hover:text-light`} icon={n.icon || faQuestion} />
                    </Link>
                )
            })}
        </div>
        <FontAwesomeIcon className='text-[30px]' icon={faUser} color={'white'} />
    </div>
}