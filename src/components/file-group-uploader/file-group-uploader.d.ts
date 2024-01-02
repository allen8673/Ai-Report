import { AccordionTabProps } from "primereact/accordion";

export type FileGroups = Record<string, File[]>

export interface GroupingFileUploaderProps {
    grouping: string[];
    name?: string;
    onUpload: (fileGroups: FileGroups) => void,
    uploadLabel?: string;
}

export interface HeaderTemplateProps {
    title: string;
    opts: AccordionTabProps;
    onFilesSelect?: (files: File[]) => void
}