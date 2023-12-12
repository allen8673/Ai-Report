import monaco from 'monaco-editor';

export default {
    base: 'vs-dark',
    inherit: true,
    rules: [
        { token: 'comment.abap', foreground: '#5c6370' }, // comments
        { token: 'comment.quote.abap', foreground: '#5c6370' }, // quotes of comments
        { token: 'custom-variable', foreground: '#dbb26a' },
        { token: 'custom-variable.bracket', foreground: '#dbb26a' },
        { token: 'delimiter.abap', foreground: '#de5d6c' }, // . ;
        { token: 'identifier.abap', foreground: '#abb2bf' }, // schema / table / column names and ,
        { token: 'identifier.quote.abap', foreground: '#abb2bf' }, // quote marks
        { token: 'invalid.abap', foreground: '#c02121', background: '#ABB2BF' },
        { token: 'keyword.abap', foreground: '#61afef' }, // basic sql commands
        { token: 'keyword.block', foreground: '#61afef' }, // CASE
        { token: 'keyword.catch', foreground: '#61afef' },
        { token: 'keyword.choice', foreground: '#61afef' }, // WHEN, THEN
        { token: 'keyword.try', foreground: '#61afef' },
        { token: 'number.abap', foreground: '#d19a66' }, // number
        { token: 'operator.abap', foreground: '#61afef' }, // operators e.g. ||, JOIN, FROM
        { token: 'predefined.abap', foreground: '#e06c75' },
        { token: 'string.abap', foreground: '#98c379' }, // string

        // { token: 'white', foreground: '#AAAAAA' }, // whitespace
    ],
    colors: {
        'editor.selectionBackground': '#264f78',
        'editor.inactiveSelectionBackground': '#264f78',
        'editor.selectionHighlightBackground': '#264f78',
    },
} as monaco.editor.IStandaloneThemeData;
