import { IconDefinition, faBarsProgress, faHome, faMagicWandSparkles } from "@fortawesome/free-solid-svg-icons";
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
    WORKFLOW_EDITOR: { title: 'Workflow', folder: 'workflow-editor', icon: faBarsProgress, parent: "WORKFLOW" },
}

export function getFullUrl(router: IRouter | undefined): string {
    if (!router?.folder) return ''
    let parentUrl = '';
    const parent = RouterInfo[router.parent || '']
    if (!!parent) {
        parentUrl = getFullUrl(parent)
    }
    return `${parentUrl}/${router.folder}`;
}

export default RouterInfo