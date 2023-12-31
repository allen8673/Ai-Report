import { type ClassValue, clsx } from "clsx"
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
