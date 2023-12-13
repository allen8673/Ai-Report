import monaco from 'monaco-editor';

export default {
    base: 'vs-dark',
    inherit: true,
    rules: [
        { token: 'predefined.r', foreground: '#e06c75' },
        { token: 'comment.r', foreground: '#5c6370' }, // comments
        { token: 'comment.doc.r', foreground: '#5c6370' }, // comments
        { token: 'comment.quote.r', foreground: '#5c6370' }, // quotes of comments
        { token: 'tag.r', foreground: '#d36fe4' }, // tags
        { token: 'number.r', foreground: '#d19a66' }, // number
        { token: 'string.r', foreground: '#98c379' }, // string
        { token: 'constant.r', foreground: '#D19A66' }, // number
        { token: 'string.escape.r', foreground: '#98c379' }, // string
        { token: 'delimiter.r', foreground: '#ABB2BF' }, // .
        { token: 'delimiter.parenthesis.r', foreground: '#ABB2BF' }, // ()
        { token: 'delimiter.curly.r', foreground: '#ABB2BF' }, // {}
        { token: 'identifier.r', foreground: '#61afef' }, // schema / table / column names and ,
        { token: 'identifier.quote.r', foreground: '#61afef' }, // quote marks
        { token: 'operator.r', foreground: '#ABB2BF' }, // operators e.g. ||, JOIN, FROM
        { token: 'keyword.r', foreground: '#d36fe4' }, // basic sql commands
        { token: 'keyword.block', foreground: '#d36fe4' }, // CASE
        { token: 'keyword.choice', foreground: '#d36fe4' }, // WHEN, THEN
        { token: 'keyword.try', foreground: '#d36fe4' },
        { token: 'keyword.catch', foreground: '#d36fe4' },
        { token: 'keyword.other', foreground: '#d36fe4' }, // tags

        { token: 'custom-variable.bracket', foreground: '#dbb26a' },
        { token: 'custom-variable', foreground: '#dbb26a' },
        // { token: 'white', foreground: '#AAAAAA' }, // whitespace
    ],
    colors: {
        'editor.selectionBackground': '#264f78',
        'editor.inactiveSelectionBackground': '#264f78',
        'editor.selectionHighlightBackground': '#264f78',
    },
} as monaco.editor.IStandaloneThemeData;
