import { faFire, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function SideMenu() {

    return <div className={`w-[50px] bg-std-deep rounded-std flex flex-col justify-center std-p`}>
        <div className='flex flex-row grow shrink'>
            <FontAwesomeIcon className='h-[30px] w-[30px]' icon={faFire} color={'white'} />
        </div>
        <FontAwesomeIcon className='h-[30px] w-[30px]' icon={faUser} color={'white'} />
    </div>
}