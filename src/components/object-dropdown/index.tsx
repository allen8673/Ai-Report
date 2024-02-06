import { find, map } from "lodash";
import { DropdownChangeEvent, Dropdown, DropdownProps } from "primereact/dropdown";
import { ReactElement, useEffect, useState } from "react";


export interface ObjectDropdownProps<T extends { [key: string]: any }> extends
    Omit<DropdownProps, 'valueTemplate' | 'itemTemplate' | 'value' | 'defaultValue' | 'options' | 'onChange'> {
    options?: T[];
    value?: T;
    defaultValue?: T;
    valueKey: string;
    reanderOption?: (item?: T) => ReactElement;
    onChange?: (val?: T) => void;
}

export default function ObjectDropdown<T extends { [key: string]: any }>({
    id, options, value, defaultValue, valueKey, reanderOption, onChange,
    ...props }: ObjectDropdownProps<T>) {

    const [selectedKey, setSelectedKey] = useState<string | undefined>(defaultValue?.[valueKey]);
    const [keyOptions, setKeyOptions] = useState<string[]>([]);

    useEffect(() => {
        _setSelectedItem(value?.[valueKey])
    }, [value])

    useEffect(() => {
        const _keyOpts = map(options, opt => opt[valueKey])
        setKeyOptions(_keyOpts)
        if (!_keyOpts.includes(selectedKey)) {
            _setSelectedItem(options?.[0]?.[valueKey])
        }
    }, [options]);

    const _setSelectedItem = (key?: string) => {
        setSelectedKey(pre => {
            if (key !== pre) {
                onChange?.(find(options, [valueKey, key]))
            }
            return key;
        })

    }

    const _valueTemplate = (opt: string, { placeholder }: DropdownProps) => {
        if (opt) {
            return reanderOption?.(find(options, [valueKey, opt]))
        }

        return <i className="text-light-weak">{placeholder}</i>;
    }

    const _itemTemplate = (opt: string) => {
        return reanderOption?.(find(options, [valueKey, opt]))
    }

    const _onChange = (e: DropdownChangeEvent) => {
        const key: string = e.value;
        _setSelectedItem(key);
    }

    return (
        <Dropdown
            id={id}
            value={selectedKey}
            options={keyOptions}
            valueTemplate={!!reanderOption && _valueTemplate}
            itemTemplate={!!reanderOption && _itemTemplate}
            onChange={_onChange}
            {...props}
        />
    )
}