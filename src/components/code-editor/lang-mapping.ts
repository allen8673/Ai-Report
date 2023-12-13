import languages from './language';
import theme from './theme';
import { LangMappingProps } from './type';

const langMapping: LangMappingProps = {
    abap: {
        language: 'idhabap',
        idhLang: {
            id: 'idhabap',
            tokensProvider: languages['idhabap'].language,
            configuration: languages['idhabap'].conf,
        },
        theme: { id: 'idhabap-theme', config: theme['idhabap'] },
    },
    json: {
        language: 'json',
        idhLang: {
            id: 'idhjson',
            tokensProvider: languages['idhjson'].language,
            configuration: languages['idhjson'].conf,
        },
        theme: { id: 'idhjson-theme', config: theme['idhjson'] },
    },
    // python: {
    //     language: 'idhpython',
    //     idhLang: {
    //         id: 'idhpython',
    //         tokensProvider: languages['idhpython'].language,
    //         configuration: languages['idhpython'].conf,
    //     },
    //     theme: { id: 'idhpython-theme', config: theme['idhpython'] },
    // },
    r: {
        language: 'idhr',
        idhLang: {
            id: 'idhr',
            tokensProvider: languages['idhr'].language,
            configuration: languages['idhr'].conf,
        },
        theme: { id: 'idhr-theme', config: theme['idhr'] },
    },
    shell: {
        language: 'idhshell',
        idhLang: {
            id: 'idhshell',
            tokensProvider: languages['idhshell'].language,
            configuration: languages['idhshell'].conf,
        },
        theme: { id: 'idhshell-theme', config: theme['idhshell'] },
    },
    sql: {
        language: 'idhsql',
        idhLang: {
            id: 'idhsql',
            tokensProvider: languages['idhsql'].language,
            configuration: languages['idhsql'].conf,
        },
        theme: { id: 'idhsql-theme', config: theme['idhsql'] },
    },
    pql: {
        language: 'idhpql',
        idhLang: {
            id: 'idhpql',
            tokensProvider: languages['idhpql'].language,
            configuration: languages['idhpql'].conf,
        },
        // pql is sql extended, so dirrctly use sql theme(theme['idhsql']) as pql theme
        theme: { id: 'idhpql-theme', config: theme['idhsql'] },
    },
    md: {
        language: 'idhmd',
        idhLang: {
            id: 'idhmd',
            tokensProvider: languages['idhmd'].language,
            configuration: languages['idhmd'].conf,
        },
        theme: { id: 'idhmd-theme', config: theme['idhmd'] },
    },
};

export default langMapping;
