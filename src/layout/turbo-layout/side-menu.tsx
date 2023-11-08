import { faFire, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'primeicons/primeicons.css';

export default function SideMenu() {

    return <div className={`w-[50px] bg-[#5b5b5b41] std-rounded flex flex-col justify-center std-p`}>
        <div className='flex flex-row grow shrink'>
            <FontAwesomeIcon className='h-[30px] w-[30px]' icon={faFire} color={'white'} />
        </div>
        <FontAwesomeIcon className='h-[30px] w-[30px]' icon={faUser} color={'white'} />
    </div>
}