import monaco from 'monaco-editor';

export default {
    base: 'vs-dark',
    inherit: true,
    rules: [
        { token: 'predefined.json', foreground: '#e06c75' },
        { token: 'comment.json', foreground: '#5c6370' }, // comments
        { token: 'comment.quote.json', foreground: '#5c6370' }, // quotes of comments
        { token: 'number.json', foreground: '#d19a66' }, // number
        { token: 'string.json', foreground: '#98c379' }, // string
        { token: 'string.value.json', foreground: '#ABB2BF' }, // string val
        { token: 'string.key.json', foreground: '#61afef' }, // string key
        { token: 'delimiter.json', foreground: '#c678dd' }, // .
        { token: 'delimiter.comma.json', foreground: '#d36fe4' }, // ,
        { token: 'delimiter.colon.json', foreground: '#d36fe4' }, // {}
        { token: 'delimiter.bracket.json', foreground: '#d36fe4' }, // {}
        { token: 'delimiter.array.json', foreground: '#d36fe4' }, // []
        { token: 'identifier.json', foreground: '#abb2bf' }, // schema / table / column names and ,
        { token: 'identifier.quote.json', foreground: '#abb2bf' }, // quote marks
        { token: 'operator.json', foreground: '#61afef' }, // operators e.g. ||, JOIN, FROM
        { token: 'keyword.json', foreground: '#de5d6c' }, // basic sql commands
        { token: 'keyword.block', foreground: '#61afef' }, // CASE
        { token: 'keyword.choice', foreground: '#61afef' }, // WHEN, THEN
        { token: 'keyword.try', foreground: '#61afef' },
        { token: 'keyword.catch', foreground: '#61afef' },
        { token: 'custom-variable.json', foreground: '#ffff00' },
        // { token: 'white', foreground: '#AAAAAA' }, // whitespace
    ],
    colors: {
        'editor.selectionBackground': '#264f78',
        'editor.inactiveSelectionBackground': '#264f78',
        'editor.selectionHighlightBackground': '#264f78',
    },
} as monaco.editor.IStandaloneThemeData;
