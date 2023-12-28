import React, { SetStateAction, Dispatch, useContext } from "react";

export interface AiDrawStore {
    setHtml: Dispatch<SetStateAction<string>>
}

export const AiDrawContext = React.createContext<AiDrawStore>({
    setHtml: () => { }
});

export const useAiDrawContext = (): AiDrawStore => useContext(AiDrawContext);
