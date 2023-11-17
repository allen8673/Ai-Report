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
        ...others } = props
    return <Dialog
        header={title}
        onHide={() => { }}
        closable={false}
        footer={footer ||
            <div className="flex justify-center">
                {!!onCancel && <Button label={cancelLabel || 'Cancel'} severity='secondary' onClick={onCancel} />}
                {!!onOk && <Button label={okLabel || 'OK'} onClick={onOk} />}
            </div>}
        visible={visible}
        style={{ width: '50vw' }}
        modal
        onMaskClick={cancelByMask ? onCancel : undefined}
        {...others}
    >
        {(visible || stickyContentOnClose) && children}
    </Dialog>
}