'use client'
import { faFire, faQuestion, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import _ from 'lodash';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import RouterInfo, { getFullUrl } from '@/settings/router-setting';

export default function SideMenu() {
    const pathname = usePathname()
    const navigations = _.filter(RouterInfo, ['isNavigation', true])
    return <div className={`w-[60px] min-w-[60px] bg-deep rounded-std flex flex-col items-center py-std gap-std`}>
        <FontAwesomeIcon className='h-[30px] w-[30px]' icon={faFire} color={'white'} />
        <div className='flex flex-col grow shrink gap-[6px]'>
            {_.map(navigations, n => {
                const url = getFullUrl(n);
                const onselected = (!n.folder && pathname === '/') || (!!n.folder && _.includes(pathname, n.folder))
                return (
                    <Link key={n.title} className={`flex-center p-[7px] ${onselected ? "text-light border-solid rounded-std-sm rounded-light" : 'text-light-weak'}`} href={url || "/"}>
                        <FontAwesomeIcon className={`flex-center h-[20px] w-[20px]  hover:text-light`} icon={n.icon || faQuestion} />
                    </Link>
                )
            })}
        </div>
        <FontAwesomeIcon className='h-[30px] w-[30px]' icon={faUser} color={'white'} />
    </div>
}