import HeaderBar from './header-bar'
import SideMenu from './side-menu';
import './standar-layout.css'

export default function StandarLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="standar-layout flex items-stretch">
            <SideMenu />
            <div className='grow shrink'>
                <HeaderBar title='Home' />
                <main className='main-view bg-gray-50'>
                    {children}
                </main>
            </div>
        </div>
    );
}
