export interface ApiResult<T = any> {
    status: 'success' | 'failure';
    message?: string;
    data?: T
}