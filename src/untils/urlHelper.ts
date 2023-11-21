import qs from 'qs'

export const coverToQueryString = <T>(obj: T): string => {
    const qStr = qs.stringify(obj)
    return !!qStr ? `?${qStr}` : ''
}

export const coverSearchParamsToObj = <T>(searchParams: any): T => {
    const obj: Record<string, string> = {};

    for (const key of searchParams.keys()) {
        obj[key] = searchParams.get(key)
    }

    return obj as T;
}