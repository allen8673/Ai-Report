
import React from "react";
import { ControllerFieldState, ControllerRenderProps, Path, RegisterOptions, UseFormReturn, UseFormStateReturn } from "react-hook-form";



export type FormValue = Record<string, any>;
export type FormInstance<T extends FormValue> = UseFormReturn<T, T, any>

export interface GetItemProps<T extends FormValue> {
    formInstance: FormInstance<T>
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
    valuePropName?: string
}