import monaco from 'monaco-editor';

export default {
    base: 'vs-dark',
    inherit: true,
    rules: [],
    colors: {
        'editor.selectionBackground': '#264f78',
        'editor.inactiveSelectionBackground': '#264f78',
        'editor.selectionHighlightBackground': '#264f78',
        // 'editor.selectionBackground': '#c8e5ff',
        // 'editor.inactiveSelectionBackground': '#c8e5ff',
        // 'editor.selectionHighlightBackground': '#c8e5ff',
    },
} as monaco.editor.IStandaloneThemeData;
