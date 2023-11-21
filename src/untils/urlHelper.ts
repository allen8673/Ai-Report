import qs from 'qs'

export const coverToQueryString = <T>(obj: T): string => {
    const qStr = qs.stringify(obj)
    return !!qStr ? `?${qStr}` : ''
}