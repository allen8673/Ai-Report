import { AccordionTabProps } from "primereact/accordion";

export type FileGroups = Record<string, File[]>

export interface GroupingFileUploaderProps {
    grouping?: string[];
    name?: string;
    onUpload: (fileGroups: FileGroups) => void;
    uploadLabel?: string;
    uploaderRef?: React.Ref<FileGroupUploaderInstance>;
    hideUploadButton?: boolean;
    onChange?: (fileGroups: FileGroups) => void;
    accept?: string
}

export interface HeaderTemplateProps {
    group: string;
    opts: AccordionTabProps;
}

export interface ItemTemplateProps {
    group: string;
    file: File;
}

export interface FileGroupUploaderInstance {
    upload: () => void;
}