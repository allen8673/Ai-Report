import monaco from 'monaco-editor';

export default {
    base: 'vs-dark',
    inherit: true,
    rules: [
        { token: 'predefined.shell', foreground: '#e06c75' },
        { token: 'comment.shell', foreground: '#5c6370' }, // comments
        { token: 'comment.quote.shell', foreground: '#5c6370' }, // quotes of comments
        { token: 'metatag.shell', foreground: '#5c6370' }, // quotes of comments
        { token: 'number.shell', foreground: '#d19a66' }, // number
        { token: 'string.shell', foreground: '#ABB2BF' }, // string
        { token: 'variable.shell', foreground: '#98c379' }, // variable
        { token: 'attribute.name.shell', foreground: '#de5d6c' }, // variable
        { token: 'delimiter.shell', foreground: '#c678dd' }, // .
        { token: 'delimiter.square.shell', foreground: '#c678dd' },
        { token: 'identifier.shell', foreground: '#abb2bf' }, // schema / table / column names and ,
        { token: 'identifier.quote.shell', foreground: '#abb2bf' }, // quote marks
        { token: 'operator.shell', foreground: '#61afef' }, // operators e.g. ||, JOIN, FROM
        { token: 'keyword.shell', foreground: '#61afef' }, // basic sql commands
        { token: 'keyword.block', foreground: '#61afef' }, // CASE
        { token: 'keyword.choice', foreground: '#61afef' }, // WHEN, THEN
        { token: 'keyword.try', foreground: '#61afef' },
        { token: 'keyword.catch', foreground: '#61afef' },
        { token: 'keyword.other', foreground: '#ABB2BF' },
        { token: 'type.identifier.shell', foreground: '#61afef' },
        // { token: 'white', foreground: '#AAAAAA' }, // whitespace

        { token: 'custom-variable.bracket', foreground: '#dbb26a' },
        { token: 'custom-variable', foreground: '#dbb26a' },
    ],
    colors: {
        'editor.selectionBackground': '#264f78',
        'editor.inactiveSelectionBackground': '#264f78',
        'editor.selectionHighlightBackground': '#264f78',
    },
} as monaco.editor.IStandaloneThemeData;
