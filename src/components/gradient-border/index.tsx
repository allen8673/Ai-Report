import React from "react"

export interface GradientBorderProps extends React.PropsWithChildren {
    className?: string;
    borderWidth?: number;
    onSelected?: boolean;
    borderClass?: string;
    selectedClass?: string;
}

export default function GradientBorder({ className, borderClass, selectedClass, borderWidth, onSelected, children }: GradientBorderProps) {
    return (
        <div
            className={`gradient-border  ${borderClass}  ${onSelected ? (selectedClass || 'bg-turbo') : ('bg-none')}`}
            style={{ padding: borderWidth || 1, }} >
            <div className={`wrapper flex-center bg-[#3c3c3c] ${className}`}>
                {children}
            </div>
        </div>)
}