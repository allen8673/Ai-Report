
import React, { ReactNode } from "react";
import {
    ControllerFieldState,
    ControllerRenderProps,
    Path,
    PathValue,
    RegisterOptions,
    UseFormReturn,
    UseFormStateReturn,
    DefaultValues,
    FieldArrayPath,
    FieldArrayWithId,
    UseFieldArrayReturn,
    ArrayPath
} from "react-hook-form";

import { FormInstance, FormItemProps, FormValue, GetItemProps } from "./form";

export type FormValue = Record<string, any>;
export type FormCoreInstance<T extends FormValue> = UseFormReturn<T, T, any>;

export interface FormProps<T extends Record<string, any>> {
    form?: FormInstance<T>;
    defaultValues?: DefaultValues<T>;
    children: (props: { Item: (props: FormItemProps<T>) => React.JSX.Element; List: (props: FormListProps<T>) => React.JSX.Elemen }) => ReactNode;
    onLoad?: (formInstance: FormInstance<T>) => void;
    onDestroyed?: () => void
    className?: string;
    onSubmit?: (data: T) => void;
    readonly?: boolean;
}

export interface FormInstance<T extends FormValue> {
    getValues: () => T;
    setValue: (name: Path<T>, value: PathValue<T, Path<T>>, options?: Partial<{ shouldValidate: boolean; shouldDirty: boolean; shouldTouch: boolean; }>) => void
    formCore: FormCoreInstance<T>;
    submit: () => Promise<T>
}
export interface GetItemProps<T extends FormValue> {
    formCore: FormCoreInstance<T>;
    readonly?: boolean;
}

export interface FormItemChildren<T extends FormValue> {
    field: ControllerRenderProps<T, Path<T>>;
    fieldState: ControllerFieldState;
    formState: UseFormStateReturn<T>;
}

export interface FormItemProps<T extends FormValue> {
    name: Path<T>;
    className?: string;
    children: React.ReactElement | ((props: FormItemChildren<T>) => React.ReactElement);
    label?: string;
    rules?: Omit<RegisterOptions<T, Path<T>>, "disabled" | "valueAsNumber" | "valueAsDate" | "setValueAs">;
    valuePropName?: string;
    disableFlowLabel?: boolean;
}

export interface FormListChildren<T extends FormValue> {
    fields: FieldArrayWithId<T, ArrayPath<T>, "id">[];

}

export interface FormListProps<T extends FormValue> {
    name: FieldArrayPath<T>;
    className?: string;
    children: ((props: UseFieldArrayReturn<T, ArrayPath<T>, "id">) => React.ReactElement);
    label?: string;
}