import monaco from 'monaco-editor';

export default {
    base: 'vs-dark',
    inherit: true,
    rules: [
        { token: 'predefined.sql', foreground: '#e06c75' },
        { token: 'predefined.pql', foreground: '#e06c75' },
        { token: 'comment.sql', foreground: '#5c6370' }, // comments
        { token: 'comment.quote.sql', foreground: '#5c6370' }, // quotes of comments
        { token: 'number.sql', foreground: '#d19a66' }, // number
        { token: 'string.sql', foreground: '#98c379' }, // string
        { token: 'delimiter.sql', foreground: '#c678dd' }, // .
        { token: 'identifier.sql', foreground: '#abb2bf' }, // schema / table / column names and ,
        { token: 'identifier.quote.sql', foreground: '#98c379' }, // quote marks
        { token: 'operator.sql', foreground: '#61afef' }, // operators e.g. ||, JOIN, FROM
        { token: 'keyword.sql', foreground: '#61afef' }, // basic sql commands
        { token: 'keyword.block', foreground: '#61afef' }, // CASE
        { token: 'keyword.choice', foreground: '#61afef' }, // WHEN, THEN
        { token: 'keyword.try', foreground: '#61afef' },
        { token: 'keyword.catch', foreground: '#61afef' },
        // { token: 'white', foreground: '#AAAAAA' }, // whitespace

        { token: 'custom-variable.bracket', foreground: '#dbb26a' }, // variable
        { token: 'custom-variable', foreground: '#dbb26a' }, // variable
        { token: 'datamodel-variable.bracket', foreground: '#b19cd9' }, // datamodel
        { token: 'datamodel-variable', foreground: '#b19cd9' }, // datamodel
        { token: 'quotedIdentifier.sql', foreground: '#98c379' }, // double quote marks
    ],
    colors: {
        'editor.selectionBackground': '#264f78',
        'editor.inactiveSelectionBackground': '#264f78',
        'editor.selectionHighlightBackground': '#264f78',
    },
} as monaco.editor.IStandaloneThemeData;
