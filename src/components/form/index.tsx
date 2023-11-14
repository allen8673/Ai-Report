import { classNames } from "primereact/utils";
import React, { ReactNode, useEffect } from "react";
import { Controller, DefaultValues, Path, UseFormReturn, useForm } from "react-hook-form";

import { FormInstance, FormItemProps, FormValue, GetItemProps } from "./form";
import './form.css'



function GetItem<T extends FormValue>({ formInstance, }: GetItemProps<T>) {
    const { control, formState: { errors } } = formInstance;
    const getFormErrorMessage = (name: Path<T>): React.ReactNode => {
        const msg: string = errors[name]?.message as string || ''
        return <>{msg && <small className="p-error">{msg}</small>}</>
    };

    return function FormItem({ children, name, label, rules, valuePropName = 'value' }: FormItemProps<T>) {
        return (
            <div className="mt-[24px]">
                <span className="p-float-label">
                    <Controller name={name} control={control} rules={rules} render={typeof children === 'function' ? children : ({ field, fieldState }) => (
                        React.cloneElement(children, {
                            id: field.name,
                            ...field,
                            [valuePropName]: field.value,
                            className: `${classNames({ 'p-invalid': fieldState.invalid, })} ${children?.props?.className || ''}`
                        })
                    )} />
                    <label htmlFor="name" className={classNames({ 'p-error': errors.name })}>{label || name}</label>
                </span>
                {getFormErrorMessage(name)}
            </div>
        )
    }
}

export interface FormProps<T extends Record<string, any>> {
    form?: UseFormReturn<T, T, undefined>;
    defaultValues?: DefaultValues<T>;
    children: (formItem: (props: FormItemProps<T>) => React.JSX.Element) => ReactNode;
    onLoad?: (formInstance: FormInstance<T>) => void;
}

export default function Form<T extends Record<string, any>>({ form, defaultValues, children, onLoad }: FormProps<T>) {
    const formInstance = useForm<T, T>({ defaultValues });
    const itemElem = GetItem({ formInstance: form || formInstance });
    useEffect(() => {
        onLoad?.(formInstance)
    }, [])

    return <form className="zd-form">
        {children(itemElem)}
    </form>
}


