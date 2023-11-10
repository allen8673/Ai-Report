import SideMenu from './side-menu';
import './turbo-layout.css'

export default function TurboLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="turbo-layout flex items-stretch std-deep-bg h-screen p-[21px] std-gap">
            <SideMenu />
            <main className='main-view grow shrink'>
                {children}
            </main>
        </div>
    );
}