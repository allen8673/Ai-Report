import { faFire, faQuestion, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import _ from 'lodash';
import Link from 'next/link';

import RouterInfo, { getFullUrl } from '@/configurations/router-setting';

export default function SideMenu() {
    const navigations = _.filter(RouterInfo, ['isNavigation', true])
    return <div className={`w-[50px] bg-deep rounded-std flex flex-col items-center py-std gap-std`}>
        <FontAwesomeIcon className='h-[30px] w-[30px]' icon={faFire} color={'white'} />
        <div className='flex flex-col grow shrink gap-[6px]'>
            {_.map(navigations, n => {
                const url = getFullUrl(n);
                return (
                    <Link key={n.title} className='text-light-weak' href={`/${url}`}>
                        <FontAwesomeIcon className='flex-center h-[20px] w-[20px] hover:text-light' icon={n.icon || faQuestion} />
                    </Link>
                )
            })}
        </div>
        <FontAwesomeIcon className='h-[30px] w-[30px]' icon={faUser} color={'white'} />
    </div>
}