'use client'
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { useRef, useState } from 'react';

import { LayoutContext, ShowMessage } from './context';
import SideMenu from './side-menu';

export default function StandardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const toast = useRef<Toast>(null);
    const [bgMainview, setBgMainview] = useState<boolean>();
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

    const className = bgMainview ? 'absolute inset-0 z-0' : ' grow shrink'

    return (
        <LayoutContext.Provider value={{ showMessage, setBgMainview }}>
            <div className="turbo-layout flex items-stretch bg-deep-strong h-screen p-[21px] gap-std">
                <Toast className='border-0' ref={toast} position='top-center' />
                <ConfirmDialog />
                <SideMenu bgMainview={bgMainview} />
                <main className={className}>
                    {children}
                </main>
            </div>
        </LayoutContext.Provider>
    );
}