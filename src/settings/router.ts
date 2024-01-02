import { IconDefinition, faBarsProgress, faFlask, faHome, faMagicWandSparkles } from "@fortawesome/free-solid-svg-icons";

export interface IRouter {
    title: string;
    folder: string;
    icon?: IconDefinition;
    parent?: keyof IRouterInfo
    isNavigation?: boolean
}

export interface IRouterInfo {
    ROOT: IRouter;
    AI_REPORT: IRouter;
    HOME: IRouter;
    WORKFLOW: IRouter;
    WORKFLOW_EDITOR: IRouter;
    TEMPLATE: IRouter;
    DRAW: IRouter;
    PREVIEW: IRouter;
}

const RouterInfo: IRouterInfo = {
    ROOT: {
        title: '',
        folder: ''
    },
    AI_REPORT: {
        title: '',
        folder: 'ai-report',
        parent: "ROOT",
    },
    HOME: {
        title: 'Ai Report',
        icon: faHome,
        folder: 'home',
        isNavigation: true,
        parent: "AI_REPORT",
    },
    WORKFLOW: {
        title: 'Workflow',
        folder: 'workflow',
        icon: faBarsProgress,
        isNavigation: true,
        parent: "AI_REPORT"
    },
    WORKFLOW_EDITOR: {
        title: 'Workflow',
        folder: 'workflow-editor',
        icon: faBarsProgress,
        parent: "WORKFLOW"
    },
    TEMPLATE: {
        title: 'Template',
        folder: 'template',
        icon: faMagicWandSparkles,
        isNavigation: true,
        parent: "AI_REPORT"
    },
    DRAW: {
        title: 'Ai Draw',
        folder: 'draw',
        icon: faFlask,
        isNavigation: true,
        parent: "AI_REPORT"
    },
    PREVIEW: {
        title: '',
        folder: 'preview',
        isNavigation: false,
        parent: 'DRAW'
    }
}

export default RouterInfo