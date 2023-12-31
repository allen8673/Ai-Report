import { Button } from "primereact/button";
import { Dialog, DialogProps } from "primereact/dialog";
import React from "react";

export interface ModalProps extends Omit<DialogProps,
    'header'
    | 'closable'
    | 'visible'
    | 'onHide'
    | 'modal'
    | 'onMaskClick'> {
    title?: string;
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
        className="w-4"
        modal
        onMaskClick={cancelByMask ? onCancel : undefined}
        contentClassName={`py-2 ${contentClassName || ''}`}
        {...others}
    >
        {(visible || stickyContentOnClose) && children}
    </Dialog>
}