import { ILanguage, IRichLanguageConfiguration } from '.';

export const conf: IRichLanguageConfiguration = {
    comments: {
        lineComment: '#',
    },
    brackets: [
        ['{', '}'],
        ['[', ']'],
        ['(', ')'],
    ],
    autoClosingPairs: [
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: '"', close: '"' },
        { open: "'", close: "'" },
        { open: '`', close: '`' },
    ],
    surroundingPairs: [
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: '"', close: '"' },
        { open: "'", close: "'" },
        { open: '`', close: '`' },
    ],
};

export const language = {
    defaultToken: '',
    ignoreCase: true,
    tokenPostfix: '.shell',
    brackets: [
        { token: 'delimiter.bracket', open: '{', close: '}' },
        { token: 'delimiter.parenthesis', open: '(', close: ')' },
        { token: 'delimiter.square', open: '[', close: ']' },
    ],
    keywords: [
        'if',
        'then',
        'do',
        'else',
        'elif',
        'while',
        'until',
        'for',
        'in',
        'esac',
        'fi',
        'fin',
        'fil',
        'done',
        'exit',
        'set',
        'unset',
        'export',
        'function',
    ],
    builtins: [
        'ab',
        'awk',
        'bash',
        'beep',
        'cat',
        'cc',
        'cd',
        'chown',
        'chmod',
        'chroot',
        'clear',
        'cp',
        'curl',
        'cut',
        'diff',
        'echo',
        'find',
        'gawk',
        'gcc',
        'get',
        'git',
        'grep',
        'hg',
        'kill',
        'killall',
        'ln',
        'ls',
        'make',
        'mkdir',
        'openssl',
        'mv',
        'nc',
        'node',
        'npm',
        'ping',
        'ps',
        'restart',
        'rm',
        'rmdir',
        'sed',
        'service',
        'sh',
        'shopt',
        'shred',
        'source',
        'sort',
        'sleep',
        'ssh',
        'start',
        'stop',
        'su',
        'sudo',
        'svn',
        'tee',
        'telnet',
        'top',
        'touch',
        'vi',
        'vim',
        'wall',
        'wc',
        'wget',
        'who',
        'write',
        'yes',
        'zsh',
    ],
    // we include these common regular expressions
    symbols: /[=>!~?&|+\-*\/\^;\.,]+/,
    symbols2: /<(?!%=)/,
    // The main tokenizer for our languages
    tokenizer: {
        root: [
            { include: '@whitespace' },
            [
                /[a-zA-Z]\w*/,
                {
                    cases: {
                        '@keywords': 'keyword',
                        '@builtins': 'type.identifier',
                        '@default': 'j',
                    },
                },
            ],
            [
                /<%=/,
                {
                    token: 'custom-variable.bracket',
                    bracket: '@open',
                    next: '@variablequote',
                },
            ],
            { include: '@strings' },
            { include: '@parameters' },
            { include: '@heredoc' },
            [/[{}\[\]()]/, '@brackets'],
            [
                /-+/,
                {
                    token: 'attribute.name',
                    bracket: '@open',
                    next: '@attributeName',
                },
            ],
            [/@symbols/, 'delimiter'],
            [/@symbols2/, 'delimiter'],
            { include: '@numbers' },
            [/[,;]/, 'delimiter'],
        ],

        attributeName: [
            [
                /<%=/,
                {
                    token: 'custom-variable.bracket',
                    bracket: '@open',
                    next: '@variablequote',
                },
            ],
            [
                /[\s]/,
                {
                    token: 'attribute.name',
                    bracket: '@close',
                    next: '@pop',
                },
            ],
            [
                /[\S]*$/,
                {
                    token: 'attribute.name',
                    bracket: '@close',
                    next: '@pop',
                },
            ],
            [/./, { token: 'attribute.name', log: '11found $0 in state $S0' }],
        ],

        variablequote: [
            [/[^%>]/, 'custom-variable'],
            [
                /%>/,
                {
                    token: 'custom-variable.bracket',
                    bracket: '@close',
                    next: '@pop',
                },
            ],
        ],
        whitespace: [
            [/\s+/, 'white'],
            [/(#.*$)/, 'comment'],
            [/(^#!.*$)/, 'metatag'],
        ],
        numbers: [
            [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
            [/0[xX][0-9a-fA-F_]*[0-9a-fA-F]/, 'number.hex'],
            [/\d+/, 'number'],
        ],
        // Recognize strings, including those broken across lines
        strings: [
            [/'/, 'string', '@stringBody'],
            [/"/, 'string', '@dblStringBody'],
        ],
        stringBody: [
            [
                /<%=/,
                {
                    token: 'custom-variable.bracket',
                    bracket: '@open',
                    next: '@variablequote',
                },
            ],
            [/'/, 'string', '@popall'],
            [/./, 'string'],
        ],
        dblStringBody: [
            [
                /<%=/,
                {
                    token: 'custom-variable.bracket',
                    bracket: '@open',
                    next: '@variablequote',
                },
            ],
            [/"/, 'string', '@popall'],
            [/./, 'string'],
        ],
        heredoc: [
            [
                /(<<[-<]?)(\s*)(['"`]?)([\w\-]+)(['"`]?)/,
                ['constants', 'white', 'string.heredoc.delimiter', 'string.heredoc', 'string.heredoc.delimiter'],
            ],
        ],
        parameters: [
            [/\$\d+/, 'variable.predefined'],
            [/\$\w+/, 'variable'],
            [/\$[*@#?\-$!0_]/, 'variable'],
            [/\$'/, 'variable', '@parameterBodyQuote'],
            [/\$"/, 'variable', '@parameterBodyDoubleQuote'],
            [/\$\(/, 'variable', '@parameterBodyParen'],
            [/\$\{/, 'variable', '@parameterBodyCurlyBrace'],
        ],
        parameterBodyQuote: [
            [
                /<%=/,
                {
                    token: 'custom-variable.bracket',
                    bracket: '@open',
                    next: '@variablequote',
                },
            ],
            [/[^#:%*@\-!_']+/, 'variable'],
            [/[#:%*@\-!_]/, 'delimiter'],
            [/[']/, 'variable', '@pop'],
        ],
        parameterBodyDoubleQuote: [
            [
                /<%=/,
                {
                    token: 'custom-variable.bracket',
                    bracket: '@open',
                    next: '@variablequote',
                },
            ],
            [/[^#:%*@\-!_"]+/, 'variable'],
            [/[#:%*@\-!_]/, 'delimiter'],
            [/["]/, 'variable', '@pop'],
        ],
        parameterBodyParen: [
            [
                /<%=/,
                {
                    token: 'custom-variable.bracket',
                    bracket: '@open',
                    next: '@variablequote',
                },
            ],
            [/[^#:%*@\-!_)]+/, 'variable'],
            [/[#:%*@\-!_]/, 'delimiter'],
            [/[)]/, 'variable', '@pop'],
        ],
        parameterBodyCurlyBrace: [
            [
                /<%=/,
                {
                    token: 'custom-variable.bracket',
                    bracket: '@open',
                    next: '@variablequote',
                },
            ],
            [/[^#:%*@\-!_}]+/, 'variable'],
            [/[#:%*@\-!_]/, 'delimiter'],
            [/[}]/, 'variable', '@pop'],
        ],
    },
} as ILanguage;

export default { conf, language } as {
    conf: IRichLanguageConfiguration;
    language: ILanguage;
};
