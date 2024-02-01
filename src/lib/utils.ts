import { type ClassValue, clsx } from "clsx"
import { toNumber } from "lodash";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge"
import { v4 } from "uuid";

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


const POLLING_INTERVAL = toNumber(process.env.NEXT_PUBLIC_POLLING_INTERVAL || 30) * 1000;
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
        }, POLLING_INTERVAL);
        setExecutor(_executor)
    }

    const stopPolling = () => {
        if (executor != undefined) {
            clearTimeout(executor)
        }
    }

    return { executePolling, stopPolling }

}

interface Job {
    id: string,
    excuteFn: () => Promise<boolean>
}

export function useLongPolling() {
    const [job, setJob] = useState<Job>();

    useEffect(() => {
        if (!!job) {
            executeLongPolling(job);
        };
    }, [job]);

    useEffect(() => {
        return stopPolling;
    }, []);

    const startLongPolling = async (callbackFn: () => Promise<boolean>) => {
        setJob({ id: v4(), excuteFn: callbackFn })
    }

    const executeLongPolling = async (_job: Job) => {
        const res = await _job.excuteFn();
        if (!res) return;
        setTimeout(() => {
            setJob((pre) => {
                if (!pre || _job.id !== pre.id) return pre;
                return { ...pre }
            })
        }, POLLING_INTERVAL)
    }

    const stopPolling = () => {
        setJob(undefined);
    }

    return { startLongPolling, stopPolling }
}