import { useEffect } from "react";

import { useLayoutContext } from "./context";


export const useBackgroundMainview = () => {
    const { setBgMainview } = useLayoutContext();

    useEffect(() => {
        setBgMainview(true);
        return () => setBgMainview(false)
    }, []);
}