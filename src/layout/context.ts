import { useContext } from "react";
import React from "react";

export interface ShowMessage {
    title?: string;
    message: string;
    type?: 'success' | 'info' | 'warn' | 'error';
}

export interface LayoutStore {
    showMessage: (msg: string | ShowMessage) => void
}

export const LayoutContext = React.createContext<LayoutStore>({
    showMessage: () => { }
});

export const useLayoutContext = (): LayoutStore => useContext(LayoutContext);
