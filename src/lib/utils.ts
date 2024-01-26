import { type ClassValue, clsx } from "clsx"
import { toNumber } from "lodash";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge"

export const downloadString = (content: string, title: string, extension?: string): void => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${title}.${extension ?? 'txt'}`;
    // document.body.appendChild(element);
    element.click();
};


export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}


export function usePolling() {
    const [executor, setExecutor] = useState<NodeJS.Timeout>();

    useEffect(() => {
        return stopPolling;
    }, [executor]);

    const executePolling = async (callbackFn: () => Promise<boolean>, immediatelyExec: boolean = true) => {
        stopPolling();
        if (immediatelyExec) {
            await callbackFn();
        }
        const _executor = setInterval(async () => {
            const res = await callbackFn();
            if (!res) stopPolling();
        }, toNumber(process.env.NEXT_PUBLIC_POLLING_INTERVAL || 30000));
        setExecutor(_executor)
    }

    const stopPolling = () => {
        if (executor != undefined) {
            clearTimeout(executor)
        }
    }

    return { executePolling, stopPolling }

}