'use client'
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';

import { LayoutContext, ShowMessage } from './context';

import SideMenu from './side-menu';

import 'primereact/resources/themes/saga-purple/theme.css';
// import 'primereact/resources/themes/lara-dark-purple/theme.css';

export default function TurboLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const toast = useRef<Toast>(null);

    const showMessage = (msg: string | ShowMessage): void => {
        const className = 'toast-message'
        typeof msg === 'string' ? toast.current?.show({
            severity: 'success',
            detail: msg,
            life: 3000,
            closable: false,
            className,
        }) : toast.current?.show({
            severity: msg.type || 'success',
            summary: msg.title,
            detail: msg.message,
            life: 3000,
            closable: false,
            className,
        })
    }

    return (
        <LayoutContext.Provider value={{ showMessage }}>
            <div className="turbo-layout flex items-stretch bg-deep-strong h-screen p-[21px] gap-std">
                <Toast className='border-0' ref={toast} position='top-center' />
                <ConfirmDialog />
                <SideMenu />
                <main className='main-view grow shrink'>
                    {children}
                </main>
            </div>
        </LayoutContext.Provider>
    );
}