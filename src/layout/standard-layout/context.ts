import { Dispatch, SetStateAction, useContext } from "react";
import React from "react";

export interface ShowMessage {
    title?: string;
    message: string;
    type?: 'success' | 'info' | 'warn' | 'error';
}

export interface LayoutStore {
    showMessage: (msg: string | ShowMessage) => void;
    setBgMainview: Dispatch<SetStateAction<boolean | undefined>>;

}

export const LayoutContext = React.createContext<LayoutStore>({
    showMessage: () => { },
    setBgMainview: () => { }
});

export const useLayoutContext = (): LayoutStore => useContext(LayoutContext);
