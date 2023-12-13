import { ILanguage, IRichLanguageConfiguration } from '.';

export const conf: IRichLanguageConfiguration = {
    comments: {
        lineComment: '*',
    },
    brackets: [
        ['[', ']'],
        ['{', '}'],
        ['<%=', '%>'],
    ],
};

export const language = {
    defaultToken: 'invalid',
    ignoreCase: true,
    tokenPostfix: '.json',

    symbols: /[=><!~?&+\-*\/\^%]+/,

    tokenizer: {
        root: [
            { include: '@whitespace' },

            // [/[:,.]/, 'delimiter'],
            [/{/, { token: 'bracket', bracket: '@open', next: '@json' }],

            // [/[{}()\[\]]/, '@brackets'],

            [/'/, { token: 'string', bracket: '@open', next: '@stringquote' }],

            [/\d+/, 'number'],
        ],

        json: [
            [
                /"/,
                {
                    token: 'bracket.string',
                    bracket: '@open',
                    next: '@jsonKey',
                },
            ],
            [/:/, { token: 'colon', bracket: '@open', next: '@jsonValue' }],
            [/}/, { token: 'bracket.object', bracket: '@close', next: '@pop' }],
        ],

        jsonKey: [
            [/"/, { token: 'bracket', bracket: '@close', next: '@pop' }],
            [/[^\"]/, 'key'],
        ],

        jsonValue: [
            [
                /"/,
                {
                    token: 'bracket.string',
                    bracket: '@open',
                    next: '@stringquote',
                },
            ],
            [/{/, { token: 'bracket.object', bracket: '@open', next: '@json' }],
            [
                /\[/,
                {
                    token: 'bracket.array',
                    bracket: '@open',
                    next: '@jsonArray',
                },
            ],
            [/[,]/, { token: 'comma', bracket: '@close', next: '@json' }],
            [
                /[}]/,
                {
                    token: 'bracket.object',
                    bracket: '@close',
                    next: '@pop',
                },
            ],

            [/[0-9]+/, 'value.number'],
        ],

        jsonArray: [
            [/[,]/, { token: 'array.comma' }],
            [/\]/, { token: 'bracket.array', bracket: '@close', next: '@pop' }],
            [/[0-9]+/, 'value.number'],
            [
                /"/,
                {
                    token: 'bracket.string',
                    bracket: '@open',
                    next: '@stringquote',
                },
            ],

            [/[{]/, { token: 'array.item', bracket: '@open', next: '@json' }],
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

        stringquote: [
            [/[^"]+/, 'string'],
            [/"/, { token: 'bracket.string', bracket: '@close', next: '@pop' }],
        ],

        whitespace: [
            [/[ \t\r\n]+/, ''],
            [/^\*.*$/, 'comment'],
            [/\".*$/, 'comment'],
        ],
    },
} as ILanguage;

export default { conf, language } as {
    conf: IRichLanguageConfiguration;
    language: ILanguage;
};
