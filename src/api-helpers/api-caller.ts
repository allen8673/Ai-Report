import Axios, { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import _ from 'lodash';

// const API_PROTOCOL: string = process.env.NEXT_PUBLIC_API_PROTOCOL || window.location.protocol.replace(':', '');
const API_HOSTNAME: string = process.env.NEXT_PUBLIC_API_HOST || window.location.hostname;
const API_PORT: string | undefined = process.env.NEXT_PUBLIC_API_PORT;
const API_BASE_HOST: string = API_HOSTNAME; //`${API_PROTOCOL}://${API_HOSTNAME}`;
const API_BASE_URL: string = !!API_PORT ? `${API_BASE_HOST}:${API_PORT}/api` : `${API_BASE_HOST}/api`;

/**
 * @param disableDefaultErrorMessage    Should disable the default error handler (Use Antd Modal to show the error message in response body)
 * @param disableDefaultThrowError      Should disable throwing an error if the response body contains error.
 */
export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
    disableDefaultErrorMessage?: boolean;
    disableDefaultThrowError?: boolean;
}

export interface CustomError<T = any> extends Error {
    config: AxiosRequestConfig;
    code?: string;
    request?: any;
    response?: AxiosResponse<T>;
}

const apiCaller = Axios.create({
    baseURL: API_BASE_URL,
    timeout: Number(process.env.REACT_APP_API_TIMEOUT ?? 30000),
    headers: {
        'Cache-Control': 'no-cache',
    },
});

//#region - Setup Interceptor

export const onRequestError = async (error: AxiosError): Promise<AxiosError> => {
    return error;
};

export const onResponse = (response: AxiosResponse): AxiosResponse => {
    const { config } = response;
    const customConf = config as CustomAxiosRequestConfig;

    //#region - Special case for response with status code 200 and `error` or `data.error` property inside response

    if (!customConf.disableDefaultErrorMessage) {
        if (!_.isEmpty(response.data.error)) {
            // This logic is used to handle that back-end sends status 200 to front-end, but inside the response it contains `error`
            const message = typeof response.data.error === 'string' ? response.data.error : 'Non-string error with statu 200';

            // Throw an error or not
            if (!customConf.disableDefaultThrowError) {
                const customError = new Error(message) as CustomError;

                customError.config = response.config;
                customError.code = response.statusText;
                customError.request = response.request;
                customError.response = response;
                throw customError;
            }
        } else if (!_.isEmpty(response.data.data?.error)) {
            // This logic is used to handle that back-end sends status 200 to front-end, but inside the response it contains `data.error`
            const message = typeof response.data.data?.error === 'string' ? response.data.data?.error : 'Non-string error with statu 200';

            // Throw an error or not
            if (!customConf.disableDefaultThrowError) {
                const customError = new Error(message) as CustomError;

                customError.config = response.config;
                customError.code = response.statusText;
                customError.request = response.request;
                customError.response = response;

                throw customError;
            }
        }
    }

    //#endregion

    return response;
};

export const onResponseError = async (error: AxiosError): Promise<AxiosResponse | AxiosError | undefined> => {

    // If the requst is cancled, then we don't need to do anything here.
    if (Axios.isCancel(error)) {
        throw error;
    }
    throw error;
};

// apiCaller.interceptors.request.use(onRequest, onRequestError);
apiCaller.interceptors.response.use(onResponse, onResponseError);

//#endregion

export default apiCaller;
