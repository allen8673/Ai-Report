
import MonacoEditorReact, { BeforeMount, Monaco, OnMount } from '@monaco-editor/react';
import { debounce, forEach, includes, keys } from 'lodash';
import * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api';
import { useState, useEffect, useMemo, } from 'react';

import ErrorBoundary from '../error-boundary';

import langMapping from './lang-mapping';
import { CodeEditorProps } from './type';

export default function CodeEditor({
    runCodeFn,
    runCodeShortcutFn,
    title,
    language = '',
    hiddenBar,
    onChange,
    options,
    style,
    value,
    defaultValue,
    path,
    supporLangs,
    className,
    ...props
}: CodeEditorProps) {
    const idh_lang = langMapping[language];
    const _path: string = path || 'default';

    const [editor, setEditor] = useState<monacoEditor.editor.IStandaloneCodeEditor>();
    // const [isPartialCode, setIsPartialCode] = useState<boolean>(false);
    const [codeChanging, setCodeChanging] = useState<boolean>();

    const [codes, setCodes] = useState<Record<string, string>>({ [_path]: defaultValue || value || '' });
    // const [execCode, setExecCode] = useState<string>(defaultValue || value || '');

    // const getExecuteCode = (editor: monacoEditor.editor.IStandaloneCodeEditor): void => {
    //     const selection = editor?.getSelection();
    //     let val: string = editor?.getValue() || '';

    //     setIsPartialCode(() => {
    //         if (!!selection && !selection?.isEmpty()) {
    //             val = editor?.getModel()?.getValueInRange(selection) || val;
    //             return true;
    //         }
    //         return false;
    //     });

    //     setExecCode(val);
    // };

    const handleEditorOnMount: OnMount = (editor: monacoEditor.editor.IStandaloneCodeEditor): void => {
        setEditor(editor);
        // editor.onDidChangeCursorSelection(debounce((e) => getExecuteCode(editor), 300));
    };

    const handleBeforeMount: BeforeMount = (monaco: Monaco): void => {
        forEach(supporLangs || [language], (lang) => {
            const _idh_lang = langMapping[lang];

            if (!!_idh_lang?.theme) {
                monaco.editor.defineTheme(_idh_lang.theme.id, _idh_lang.theme.config);
            }

            if (!!_idh_lang?.idhLang) {
                monaco.languages.register({ id: _idh_lang.idhLang.id });
                monaco.languages.setMonarchTokensProvider(_idh_lang.idhLang.id, _idh_lang.idhLang.tokensProvider);
                monaco.languages.setLanguageConfiguration(_idh_lang.idhLang.id, _idh_lang.idhLang.configuration);
            }
        });

        // if (!!idh_lang?.theme) {
        //     monaco.editor.defineTheme(idh_lang.theme.id, idh_lang.theme.config);
        // }

        // if (!!idh_lang?.idhLang) {
        //     monaco.languages.register({ id: idh_lang.idhLang.id });
        //     monaco.languages.setMonarchTokensProvider(idh_lang.idhLang.id, idh_lang.idhLang.tokensProvider);
        //     monaco.languages.setLanguageConfiguration(idh_lang.idhLang.id, idh_lang.idhLang.configuration);
        // }

        // #region this is a sample code that we can add extra theme and lang tokenizer by this
        // -- Add theme
        // const { rules = [] } = idh_lang.theme.config;
        // monaco.editor.defineTheme(idh_lang.theme.id, {
        //     ...idh_lang.theme.config,
        //     rules: [...rules, { token: 'custom-color', foreground: '97eee3', fontStyle: 'italic bold' }],
        // });
        // -- Add tokenizer
        // const { String = [] } = idh_lang.idhLang.tokensProvider.tokenizer;
        // monaco.languages.setMonarchTokensProvider(idh_lang.idhLang.id, {
        //     ...idh_lang.idhLang.tokensProvider,
        //     tokenizer: {
        //         String: [...String, [/PU_MIN/, 'custom-color']],
        //     },
        // });
        // #endregion
    };

    const _onChange = useMemo(
        () =>
            debounce((val: string, __path: string) => {
                onChange?.(val, __path, editor);
                setCodeChanging(false);
            }, 1000),
        [onChange]
    );

    useEffect(() => {
        editor?.updateOptions({ readOnly: options?.readOnly });
    }, [options?.readOnly]);

    useEffect(() => {
        if (value === undefined) return;
        setCodes((pre) => {
            // pre[_path] = value;
            return { ...pre, [_path]: value };
        });
        // if (!!editor) {
        //     getExecuteCode(editor);
        // }
    }, [value]);

    useEffect(() => {
        if (includes(keys(codes), _path)) return;
        setCodes((pre) => {
            return { ...pre, [_path]: value || '' };
        });
    }, [_path]);

    return (
        <ErrorBoundary>
            <div className={`flex flex-col relative h-full w-full bg-deep ${className}`} style={style}>
                {!hiddenBar && (
                    <div className='flex justify-between px-[20px] py-[5px]'>
                        <span className="grow text-light font-bold">{title}</span>
                    </div>
                )}
                <div className="relative h-full w-full grow shrink">
                    <div className="absolute top-0 left-0 h-full w-full">
                        <MonacoEditorReact
                            options={{
                                automaticLayout: true,
                                minimap: { enabled: true },
                                ...options,
                            }}
                            value={codes[_path] || ''}
                            path={_path}
                            {...props}
                            beforeMount={(monaco: Monaco): void => {
                                handleBeforeMount(monaco);
                                if (props.beforeMount) props.beforeMount(monaco);
                            }}
                            onMount={(editor: monacoEditor.editor.IStandaloneCodeEditor, monaco: Monaco): void => {
                                handleEditorOnMount(editor, monaco);
                                if (!!runCodeFn && !!runCodeShortcutFn) {
                                    editor.addAction({
                                        id: 'run-code-hk',
                                        label: 'run code hotkey',
                                        keybindings: [monaco.KeyCode.F8, monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
                                        run: runCodeShortcutFn,
                                    });
                                }

                                if (props.onMount) props.onMount(editor, monaco);
                            }}
                            theme={idh_lang?.theme?.id || 'vs-dark'}
                            language={idh_lang?.language || language}
                            onChange={(val): void => {
                                setCodes((pre) => ({ ...pre, [_path]: val || '' }));
                                setCodeChanging(true);
                                _onChange(val || '', _path);
                            }}
                        />
                    </div>
                </div>
                {codeChanging && (
                    <div className="px-2 flex items-center  gap-2">
                        <i className="pi pi-spin pi-spinner" ></i>
                        <span className="message">Caching content...</span>
                    </div>
                )}
            </div>
        </ErrorBoundary>
    );
};

