/**
 * LANGUAGE FILES CAN BE FOUND AT: https://github.com/microsoft/monaco-languages/tree/master/src
 */

import monaco from 'monaco-editor';

import abapLanguage from './abap';
import jsonLanguage from './json';
import mdLanguage from './markdown';
import pqlLanguage from './pql';
// import pythonLanguage from './python';
import rLanguage from './r';
import shellLanguage from './shell';
import sqlLanguage from './sql';

export type IRichLanguageConfiguration = monaco.languages.LanguageConfiguration;
export type ILanguage = monaco.languages.IMonarchLanguage;

export default {
    idhabap: abapLanguage,
    idhjson: jsonLanguage,
    // idhpython: pythonLanguage,
    idhr: rLanguage,
    idhshell: shellLanguage,
    idhsql: sqlLanguage,
    idhpql: pqlLanguage,
    idhmd: mdLanguage,
} as {
    [id: string]: {
        conf: IRichLanguageConfiguration;
        language: ILanguage;
    };
};
