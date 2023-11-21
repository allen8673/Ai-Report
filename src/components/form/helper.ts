import { useRef } from "react";
import { DefaultValues, useForm as useFormCore } from "react-hook-form";

import { FormInstance } from "./form";

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
