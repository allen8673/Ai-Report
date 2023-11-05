import 'primeicons/primeicons.css';

export interface IHeaderBar {
    className?: string;
    title?: string;
}

export default function HeaderBar({ title }: IHeaderBar) {
    return (
        <div className="h-10 py-3 bg-slate-100 flex items-center">
            <span className='h-10 w-10 bg-slate-300 flex-center border-2 '>
                <i className="pi pi-apple text-lg" />
            </span>
            <div className='flex items-center text-black p-2'>{title}</div>
        </div>
    );
} 