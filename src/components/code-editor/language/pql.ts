import sqlLanguage from './sql';

import { ILanguage, IRichLanguageConfiguration } from '.';

/**
 * Since pql is sql extended, so directly use configuration and language of sql language as base code.
 */
export const conf: IRichLanguageConfiguration = {
    ...sqlLanguage.conf,
};

export const language = {
    ...sqlLanguage.language,
    tokenPostfix: '.pql',
    // can add extra functionalities name from celonis to here
    celonis: [
        //Standard Aggregation
        'COUNT_TABLE',
        'MEDIAN',
        'MODE',
        'PRODUCT',
        'QUANTILE',
        'STRING_AGG',
        'TRIMMED_MEAN',
        // Window Aggregation
        'RUNNING_TOTAL',
        // Moving Aggregation
        'MOVING_AVG',
        'MOVING_COUNT_DISTINCT',
        'MOVING_COUNT',
        'MOVING_MAX',
        'MOVING_MEDIAN',
        'MOVING_MIN',
        'MOVING_STDEV',
        'MOVING_SUM',
        'MOVING_TRIMMED_MEAN',
        'MOVING_VAR',
        // Pull Up Aggregation
        'PU_AVG',
        'PU_COUNT_DISTINCT',
        'PU_COUNT',
        'PU_FIRST',
        'PU_LAST',
        'PU_MAX',
        'PU_MEDIAN',
        'PU_MODE',
        'PU_MIN',
        'PU_PRODUCT',
        'PU_QUANTILE',
        'PU_TRIMMED_MEAN',
        'PU_STRING_AGG',
        'PU_SUM',
        'PU_STDEV',
        // Pull Up Aggregation Table Options
        'CONSTANT',
        'DOMAIN_TABLE',
        // Currency
        'CURRENCY_CONVERT_SAP',
        'CURRENCY_CONVERT',
        'CURRENCY_SAP',
        // Custom
        'KPI',
        // Data Flow
        'BIND',
        'BIND_FILTERS',
        'FILTER',
        'FILTER_TO_NULL',
        'GREATEST',
        'LEAST',
        'REMAP_INTS',
        'REMAP_VALUES',
        'UNIQUE_ID',
        // Data Generation
        'GENERATE_RANGE',
        'RANGE_APPEND',
        // Data Type Conversion
        'TO_DATE',
        'TO_FLOAT',
        'TO_INT',
        'TO_STRING',
        // DateTime
        'TIMELINE_COLUMN',
        // DateTime Calendars
        'FACTORY_CALENDAR',
        'WEEKDAY_CALENDAR',
        'WORKDAY_CALENDAR',
        // DateTime Constant
        'HOUR_NOW',
        'MINUTE_NOW',
        'TODAY',
        // DateTime Difference
        'DATE_BETWEEN',
        'DAYS_BETWEEN',
        'HOURS_BETWEEN',
        'MILLIS_BETWEEN',
        'MINUTES_BETWEEN',
        'MONTHS_BETWEEN',
        'SECONDS_BETWEEN',
        'WORKDAYS_BETWEEN',
        'YEARS_BETWEEN',
        // DateTime Modification
        'ADD_DAYS',
        'ADD_HOURS',
        'ADD_MILLIS',
        'ADD_MINUTES',
        'ADD_MONTHS',
        'ADD_SECONDS',
        'ADD_WORKDAYS',
        'ADD_YEARS',
        'CONVERT_TIMEZONE',
        // DateTime Projection
        'CALENDAR_WEEK',
        'DATE_MATCH',
        'DAY_OF_WEEK',
        'DAYS_IN_MONTH',
        'IN_CALENDAR',
        'MILLIS',
        'REMAP_TIMESTAMPS',
        'TO_TIMESTAMP',
        // DateTime Rounding
        'ROUND_YEAR',
        'ROUND_MONTH',
        'ROUND_DAY',
        'ROUND_HOUR',
        'ROUND_MINUTE',
        'ROUND_SECOND',
        'ROUND_QUARTER',
        'ROUND_WEEK',
        // Machine Learning Functions
        'KMEANS',
        'LINEAR_REGRESSION',
        // Math
        'ABC',
        'CEIL',
        'DIV',
        'INVERSE',
        'MODULO',
        'MULT',
        'SUB',
        // Process
        'ACTIVATION_COUNT',
        'ACTIVITY_LAG',
        'ACTIVITY_LEAD',
        'CALC_CROP',
        'CALC_CROP_TO_NULL',
        'CLUSTER_VARIANTS',
        'CONFORMANCE',
        'DEFAULT ACTIVITY_COLUMN',
        'SOURCE',
        'TARGET',
        'ESTIMATE_CLUSTER_PARAMS',
        'LINK_FILTER',
        'LINK_SOURCE',
        'LINK_TARGET',
        'MATCH_ACTIVITIES',
        'MERGE_EVENTLOG',
        'MERGE_EVENTLOG_DISTINCT',
        'EQUALS',
        'MATCH_PROCESS_REGEX',
        'MATCH_PROCESS',
        'PROCESS_ORDER',
        'CALC_REWORK',
        'CALC_THROUGHPUT',
        'TRANSIT_COLMN',
        'VARIANT',
        // Process Index
        'INDEX_ACTIVITY_LOOP_REVERSE',
        'INDEX_ACTIVITY_LOOP',
        'INDEX_ACTIVITY_ORDER_REVERSE',
        'INDEX_ACTIVITY_ORDER',
        'INDEX_ACTIVITY_TYPE_REVERSE',
        'INDEX_ACTIVITY_TYPE',
        // Process Reference
        'ACTIVITY_COLUMN',
        'ACTIVITY_TABLE',
        'CASE_ID_COLUMN',
        'CASE_TABLE',
        'END_TIMESTAMP_COLUMN',
        'SORTING_COLUMN',
        'TIMESTAMP_COLUMN',
        // Statistics
        'QNORM',
        'ZSCORE',
        // String Modification
        'CLUSTER_STRINGS',
        'DELETE_CHARACTERS',
        'MAP_CHARACTERS',
        'MATCH_STRINGS',
        'STRINGHASH',
        'STRING_SPLIT',
        'STR_TO_INT',
        // Window
        'INDEX_ORDER',
        'INTERPOLATE',
        'RUNNING_SUM',
        'WINDOW_AV',
    ],
    tokenizer: {
        ...sqlLanguage.language.tokenizer,
        root: [
            { include: '@comments' },
            { include: '@whitespace' },
            { include: '@pseudoColumns' },
            { include: '@numbers' },
            { include: '@strings' },
            { include: '@complexIdentifiers' },
            { include: '@scopes' },
            [
                /<%=dm_/,
                {
                    token: 'datamodel-variable.bracket',
                    bracket: '@open',
                    next: '@datamodelquote',
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
            [/[;,.]/, 'delimiter'],
            [/[()]/, '@brackets'],
            [
                /[\w@#$]+/,
                {
                    cases: {
                        '@celonis': 'predefined',
                        '@keywords': 'keyword',
                        '@operators': 'operator',
                        '@builtinVariables': 'predefined',
                        '@builtinFunctions': 'predefined',
                        '@default': 'identifier',
                    },
                },
            ],
            [/[<>=!%&+\-*/|~^]/, 'operator'],
        ],
    },
} as ILanguage;

export default { conf, language } as {
    conf: IRichLanguageConfiguration;
    language: ILanguage;
};
