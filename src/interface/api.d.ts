export interface ApiResult<T = any> {
    status: 'success' | 'failure' | 'ok';
    message?: string;
    data?: T,
    message?: string
}