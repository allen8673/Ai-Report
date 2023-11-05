import 'primeicons/primeicons.css';

export default function HeaderBar() {
    return (
        <div className="h-10 py-3 bg-slate-100 flex items-center">
            <span className='h-10 w-10 bg-slate-300 flex-center border-2 '>
                <i className="pi pi-user text-lg" />
            </span>
            <div className='flex items-center text-black p-2'>Title...</div>
        </div>
    );
} 