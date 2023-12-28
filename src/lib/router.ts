import RouterInfo, { IRouter } from "@settings/router";

export function getFullUrl(router: IRouter | undefined): string {
    let parentUrl = '';
    if (!router?.folder || !router.parent) return parentUrl;

    const parent = RouterInfo[router.parent]
    if (!!parent) {
        parentUrl = getFullUrl(parent)
    }
    return `${parentUrl}/${router.folder}`;
}