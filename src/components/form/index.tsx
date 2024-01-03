import { classNames } from "primereact/utils";
import React, { useEffect, useRef } from "react";
import { Controller, DefaultValues, useForm as useFormCore, Path, useFieldArray, } from "react-hook-form";

import ErrorBoundary from "../error-boundary";

import { FormInstance, FormItemProps, FormListProps, FormProps, FormValue, GetItemProps } from "./form";

function getList<T extends FormValue>({ formCore }: GetItemProps<T>) {
    const { control } = formCore;

    return function FormList<T extends FormValue>({ name, children, label, className }: FormListProps<T>) {
        const fieldArray = useFieldArray<T>({
            control: (control as any),
            name
        });

        return <div className={`${(!!label ? "mt-[28px]" : '')} ${className || ''}`}>
            <span className={(!!label ? `p-float-label` : '')}>
                {children(fieldArray)}
                {!!label && <label htmlFor={name} className='normal-lable'>{label}</label>}
            </span>
        </div>
    }
}

function getItem<T extends FormValue>({ formCore, readonly }: GetItemProps<T>) {
    const { control, formState: { errors } } = formCore;
    const getFormErrorMessage = (name: Path<T>): React.ReactNode => {
        const msg: string = errors[name]?.message as string || ''
        return <>{msg && <small className="p-error">{msg}</small>}</>
    };

    return function FormItem(props: FormItemProps<T>) {
        const {
            children,
            className,
            name,
            label,
            rules,
            valuePropName = 'value',
            disableFlowLabel,
            disabled,
            defaultValue
        } = props

        useEffect(() => {
            const value = formCore.getValues()?.[name]
            if (!value && !!defaultValue) {
                formCore.setValue(name, defaultValue)
            }
        }, [])

        return (
            <div className={`${(!!label ? "mt-[28px]" : '')} ${className || ''}`}>
                <span className={(!!label ? `p-float-label` : '')}>
                    <Controller
                        name={name}
                        control={control}
                        rules={rules}
                        disabled={readonly || disabled}
                        render={typeof children === 'function' ? children : ({ field, fieldState }) => {
                            return (
                                React.cloneElement(children, {
                                    id: field.name,
                                    ...field,
                                    [valuePropName]: field.value,
                                    className: `${classNames({ 'p-invalid': fieldState.invalid, })} ${children?.props?.className || 'w-full'}`,
                                })
                            )
                        }} />

                    {!!label && <label htmlFor={name} className={classNames({
                        'p-error': errors?.[name],
                        'normal-lable': disableFlowLabel
                    })}>{label}</label>}
                </span>
                {getFormErrorMessage(name)}
            </div>
        )
    }
}

export const useForm = <T extends Record<string, any>>(_form?: FormInstance<T>, defaultValues?: DefaultValues<T>)
    : { form: FormInstance<T> } => {
    const formCore = useFormCore<T, T>({ defaultValues, mode: 'onBlur', reValidateMode: 'onBlur' });
    const submit = async (): Promise<T> => new Promise<T>((resolve, reject) => {
        formCore.handleSubmit(
            (data) => resolve(data),
            (e) => {
                reject(e)
            }
        )()
    })
    const form = useRef<FormInstance<T>>({
        getValues: () => {
            return formCore.getValues()
        },
        setValue: (name, value, options) => {
            formCore.setValue(name, value, options)
        },
        formCore,
        submit
    }).current;
    return { form: _form || form }

}

export default function Form<T extends Record<string, any>>(props: FormProps<T>) {
    const {
        form,
        defaultValues,
        children,
        onLoad,
        className,
        onDestroyed,
        onSubmit,
        readonly
    } = props;

    const { form: formInstance } = useForm<T>(form, defaultValues);
    const { formCore, submit } = formInstance

    const FormItem = getItem({ formCore: formInstance.formCore, readonly });
    const FormList = getList({ formCore: formInstance.formCore })
    useEffect(() => {
        onLoad?.(formInstance);
        return onDestroyed
    }, [])

    return <ErrorBoundary>
        <form className={`zd-form text-deep ${className}`}
            onSubmit={formCore.handleSubmit(async () => {
                const data = await submit();
                await onSubmit?.(data);
            })}>
            {children({ Item: FormItem, List: FormList })}
        </form>
    </ErrorBoundary>

}


