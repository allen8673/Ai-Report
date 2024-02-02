
export interface IRouter {
    title: string;
    folder: string;
    icon?: string;
    parent?: keyof IRouterInfo;
    isNavigation?: boolean;
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
        icon: 'pi-home',
        folder: 'home',
        isNavigation: true,
        parent: "AI_REPORT",
    },
    WORKFLOW: {
        title: 'Workflow',
        folder: 'workflow',
        icon: 'pi-sitemap',
        isNavigation: true,
        parent: "AI_REPORT"
    },
    WORKFLOW_EDITOR: {
        title: 'Workflow',
        folder: 'workflow-editor',
        parent: "WORKFLOW"
    },
    TEMPLATE: {
        title: 'Template',
        folder: 'template',
        icon: 'pi-th-large',
        isNavigation: true,
        parent: "AI_REPORT"
    },
    DRAW: {
        title: 'Ai Draw',
        folder: 'draw',
        icon: 'pi-code',
        isNavigation: true,
        parent: "AI_REPORT"
    },
    PREVIEW: {
        title: '',
        folder: 'preview',
        parent: 'DRAW'
    }
}

export default RouterInfo