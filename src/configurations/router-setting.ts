import { IconDefinition, faBarsProgress, faHome, faMagicWandSparkles } from "@fortawesome/free-solid-svg-icons";
import _ from "lodash";

export interface IRouter {
    title: string;
    folder: string;
    icon?: IconDefinition;
    parent?: string;
    isNavigation?: boolean
}

const RouterInfo: { [key: string]: IRouter } = {
    HOME: { title: 'Home', icon: faHome, folder: '', isNavigation: true },
    WORKFLOW: { title: 'Workflow', folder: 'workflow', icon: faBarsProgress, isNavigation: true, parent: "HOME" },
    TEMPLATE: { title: 'template', folder: 'template', icon: faMagicWandSparkles, isNavigation: true, parent: "HOME" },
}

export function getFullUrl(router: IRouter): string {
    let parentUrl = '';
    const parent = RouterInfo[router.parent || '']
    if (!!parent) {
        parentUrl = getFullUrl(parent)
    }
    return _.filter([parentUrl, router.folder], i => !!i).join('/')
}

export default RouterInfo