import SideMenu from './side-menu';
import './turbo-layout.css'

export default function TurboLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="turbo-layout flex items-stretch bg-std-deep-strong h-screen p-[21px] gap-std">
            <SideMenu />
            <main className='main-view grow shrink'>
                {children}
            </main>
        </div>
    );
}