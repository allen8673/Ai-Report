'use client'
import { Tldraw, TldrawProps } from '@tldraw/tldraw'
import '@tldraw/tldraw/tldraw.css'

export type DrawerProps = TldrawProps & {
    drawerClassName?: string;
}

export default function Drawer(props: DrawerProps) {
    const { className, drawerClassName, children, ...others } = props;

    return (
        <div className={`h-full w-full ${className}`}>
            {children}
            <div className='relative w-full h-full z-1'>
                <Tldraw className={`rounded-std ${drawerClassName || ""}`} {...others} />
            </div>
        </div>
    )
}