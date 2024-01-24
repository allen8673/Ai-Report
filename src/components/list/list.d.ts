import { CSSProperties } from "react";

export interface ListProps<T> {
    data?: T[];
    renderItem: (item: T, index: number) => JSX.Element;
    className?: string;
    style?: CSSProperties;
    onItemClick?: (item: T) => void;
}