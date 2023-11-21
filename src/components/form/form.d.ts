
import React from "react";
import {
    ControllerFieldState,
    ControllerRenderProps,
    Path,
    PathValue,
    RegisterOptions,
    UseFormReturn,
    UseFormStateReturn
} from "react-hook-form";



export type FormValue = Record<string, any>;
export type FormCoreInstance<T extends FormValue> = UseFormReturn<T, T, any>
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