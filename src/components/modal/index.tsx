import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import React from "react";

export interface ModalProps {
    title?: string;
    onOk?: () => void;
    onCancel?: () => void;
    okLabel?: string;
    cancelLabel?: string;
    cancelByMask?: boolean
}

export default function Modal({ children, title, onOk, onCancel, okLabel, cancelLabel, cancelByMask }: React.PropsWithChildren<ModalProps>) {
    return <Dialog
        header={title}
        onHide={() => { }}
        closable={false}
        footer={
            <div>
                <Button label={okLabel || 'OK'} icon="pi pi-check" onClick={onOk} />
                <Button label={cancelLabel || 'Cancel'} icon="pi pi-times" onClick={onCancel} />
            </div>}
        visible={true}
        style={{ width: '50vw' }}
        modal
        onMaskClick={cancelByMask ? onCancel : undefined}
    >
        {children}
    </Dialog>
}