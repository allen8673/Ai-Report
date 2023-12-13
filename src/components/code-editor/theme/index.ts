import monaco from 'monaco-editor';

import abapTheme from './abap-theme';
import defaultTheme from './default-theme';
import jsonTheme from './json-theme';
import mdTheme from './markdown-theme';
import pythonTheme from './python-theme';
import rTheme from './r-theme';
import shellTheme from './shell-theme';
import sqlTheme from './sql-theme';
import textTheme from './text-theme';

const theme: { [key: string]: monaco.editor.IStandaloneThemeData } = {
    idhsql: sqlTheme,
    idhjson: jsonTheme,
    idhabap: abapTheme,
    idhshell: shellTheme,
    idhpython: pythonTheme,
    idhr: rTheme,
    idhmarkdown: mdTheme,
    idhtext: textTheme,
    idhdefault: defaultTheme,
};

export default theme;
