import monaco from 'monaco-editor';

export default {
    base: 'vs-dark',
    inherit: true,
    rules: [
        { token: 'predefined.python', foreground: '#e06c75' },
        { token: 'comment.python', foreground: '#5c6370' }, // comments
        { token: 'comment.quote.python', foreground: '#5c6370' }, // quotes of comments
        { token: 'number.python', foreground: '#d19a66' }, // number
        { token: 'string.python', foreground: '#98c379' }, // string
        { token: 'string.escape.python', foreground: '#98c379' }, // '
        { token: 'delimiter.python', foreground: '#de5d6c' }, // . ;
        { token: 'delimiter.parenthesis.python', foreground: '#c0699c' }, // ()
        { token: 'identifier.python', foreground: '#abb2bf' }, // schema / table / column names and ,
        { token: 'identifier.quote.python', foreground: '#abb2bf' }, // quote marks
        { token: 'operator.python', foreground: '#61afef' }, // operators e.g. ||, JOIN, FROM
        { token: 'keyword.python', foreground: '#61afef' }, // basic sql commands
        { token: 'keyword.block', foreground: '#61afef' }, // CASE
        { token: 'keyword.choice', foreground: '#61afef' }, // WHEN, THEN
        { token: 'keyword.try', foreground: '#61afef' },
        { token: 'keyword.catch', foreground: '#61afef' },

        { token: 'custom-variable.bracket', foreground: '#dbb26a' },
        { token: 'custom-variable', foreground: '#dbb26a' },
    ],
    colors: {
        'editor.selectionBackground': '#264f78',
        'editor.inactiveSelectionBackground': '#264f78',
        'editor.selectionHighlightBackground': '#264f78',
    },
} as monaco.editor.IStandaloneThemeData;
