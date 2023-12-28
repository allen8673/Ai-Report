import React, { SetStateAction, Dispatch, useContext } from "react";

export interface AiDrawerStore {
    setHtml: Dispatch<SetStateAction<string>>
}

export const AiDrawerContext = React.createContext<AiDrawerStore>({
    setHtml: () => { }
});

export const useAiDrawerContext = (): AiDrawerStore => useContext(AiDrawerContext);
