'use client'
import { useEffect } from "react";

import MatrixAnimationPanel from "@/components/panes/matrix-animation";
import { useLayoutContext } from "@/layout/standard-layout/context";

export default function Home() {

    const { setBgMainview } = useLayoutContext()
    useEffect(() => {
        setBgMainview(true);
        return () => setBgMainview(false)
    }, []);

    return (
        <div className="flex-center w-full h-full text-light" >
            <div className={`
            position: absolute
            p-7 bg-deep/[.8] z-2
            flex-center flex-col gap-[15px]
            rounded-std border-light-weak border-solid border-[3px]`}>
                <h1 className={`text-7xl text-turbo-deep-strong text-shadow-center shadow-turbo-deep`}>
                    Welcome to AI Report
                </h1>
            </div>
            <MatrixAnimationPanel
                text="NATIONAL INSTITUTE FOR CYBER SECURITY "
                randomPermutaion={false} fontColor="#95679e" />
        </div>
    )
}
