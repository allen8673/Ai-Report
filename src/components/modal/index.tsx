import { Button } from "primereact/button";
import { Dialog, DialogProps } from "primereact/dialog";
import React from "react";

import { cn } from "@/lib/utils";

export interface ModalProps extends Omit<DialogProps,
    'header'
    | 'closable'
    | 'visible'
    | 'onHide'
    | 'modal'
    | 'onMaskClick'> {
    title?: React.ReactNode;
    onOk?: () => void;
    onCancel?: () => void;
    okLabel?: string;
    cancelLabel?: string;
    cancelByMask?: boolean;
    visible?: boolean;
    stickyContentOnClose?: boolean
    footerClass?: string;
    footerPrefix?: React.ReactNode
    footerPostfix?: React.ReactNode
}

export default function Modal(props: React.PropsWithChildren<ModalProps>) {
    const {
        className,
        children,
        title,
        onOk,
        onCancel,
        okLabel,
        cancelLabel,
        cancelByMask,
        visible,
        stickyContentOnClose,
        footer,
        footerPrefix,
        footerPostfix,
        footerClass,
        contentClassName,
        ...others } = props
    return <Dialog
        header={title}
        onHide={() => { }}
        closable={false}
        footer={footer ||
            <div className={`flex gap-[7px] ${footerClass || 'justify-center'}`}>
                {footerPrefix}
                {!!onCancel && <Button className="m-0" label={cancelLabel || 'Cancel'} severity='secondary' onClick={onCancel} />}
                {!!onOk && <Button className="m-0" label={okLabel || 'OK'} onClick={onOk} />}
                {footerPostfix}
            </div>}
        visible={visible}
        className={cn(`w-4 rounded-std border-solid border-2 border-light-weak/[.5] overflow-hidden`, className)}
        modal
        onMaskClick={cancelByMask ? onCancel : undefined}
        contentClassName={`py-2 ${contentClassName || ''}`}
        {...others}
    >
        {(visible || stickyContentOnClose) && children}
    </Dialog>
}