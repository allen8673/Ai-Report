
import React, { ReactNode } from "react";
import {
    ControllerFieldState,
    ControllerRenderProps,
    Path,
    PathValue,
    RegisterOptions,
    UseFormReturn,
    UseFormStateReturn,
    DefaultValues
} from "react-hook-form";

import { FormInstance, FormItemProps, FormValue, GetItemProps } from "./form";

export type FormValue = Record<string, any>;
export type FormCoreInstance<T extends FormValue> = UseFormReturn<T, T, any>;

export interface FormProps<T extends Record<string, any>> {
    form?: FormInstance<T>;
    defaultValues?: DefaultValues<T>;
    children: (formItem: (props: FormItemProps<T>) => React.JSX.Element) => ReactNode;
    onLoad?: (formInstance: FormInstance<T>) => void;
    onDestroyed?: () => void
    className?: string;
    itemClassName?: string;
    onSubmit?: (data: T) => void
}

export interface FormInstance<T extends FormValue> {
    getValues: () => T;
    setValue: (name: Path<T>, value: PathValue<T, Path<T>>, options?: Partial<{ shouldValidate: boolean; shouldDirty: boolean; shouldTouch: boolean; }>) => void
    formCore: FormCoreInstance<T>;
    submit: () => Promise<T>
}
export interface GetItemProps<T extends FormValue> {
    formCore: FormCoreInstance<T>;
    className?: string;
}

export interface FormItemChildren<T extends FormValue> {
    field: ControllerRenderProps<T, Path<T>>;
    fieldState: ControllerFieldState;
    formState: UseFormStateReturn<T>;
}

export interface FormItemProps<T extends FormValue> {
    name: Path<T>;
    children: React.ReactElement | ((props: FormItemChildren<T>) => React.ReactElement);
    label?: string;
    rules?: Omit<RegisterOptions<T, Path<T>>, "disabled" | "valueAsNumber" | "valueAsDate" | "setValueAs">;
    valuePropName?: string;
}