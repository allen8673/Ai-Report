import { EditorProps } from '@monaco-editor/react';
import * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api';
import React from 'react';

export interface CodeEditorProps extends Omit<EditorProps, 'onChange'> {
    runCodeFn?: (code: string) => void;
    runCodeShortcutFn?: () => void;
    // runCodeFn?: (editor: monacoEditor.editor.IStandaloneCodeEditor | undefined) => void;
    title?: string | JSX.Element;
    hiddenBar?: boolean;
    onChange?: (value: string, path: string, editor?: monacoEditor.editor.IStandaloneCodeEditor) => void;
    style?: React.CSSProperties;
    supporLangs?: string[];
}

export interface LangMappingProps {
    [lang: string]: {
        language: string;
        idhLang?: {
            id: string;
            tokensProvider: monacoEditor.languages.IMonarchLanguage;
            configuration: monacoEditor.languages.LanguageConfiguration;
        };
        theme?: {
            id: string;
            config: monaco.editor.IStandaloneThemeData;
        };
    };
}
