export interface ApiResult<T = any> {
    status: 'success' | 'failure' | 'ok' | 'NG';
    message?: string;
    data?: T,
    message?: string
}