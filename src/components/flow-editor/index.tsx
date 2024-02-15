import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dictionary, find, forEach, groupBy, includes, keys, map, some } from "lodash";
import { Button } from "primereact/button";
import { confirmDialog } from "primereact/confirmdialog";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { SelectItem } from "primereact/selectitem";
import { Tooltip } from "primereact/tooltip";
import { useEffect, useRef, useState } from "react";
import { Connection, Edge, Node, NodeRemoveChange, NodeTypes } from 'reactflow'
import { v4 } from "uuid";

import DndList from "../dnd-list";
import ErrorBoundary from "../error-boundary";
import Form from "../form";
import { FormInstance } from "../form/form";
import Graph, { useGraphRef } from "../graph";
import Modal from "../modal";
import LoadingPane from "../panes/loading";

import AddButton from "./actbar-assets/add-button";
import CustomComponent from "./actbar-assets/custom-component";
import CustomComponentGroup from "./actbar-assets/custom-component-group";
import ReportComponent from "./actbar-assets/report-component";
import { EDGE_DEF_SETTING, GET_REPORT_COMPONENTS } from "./configuration";
import { FlowGrapContext, useFlowGrapContext } from "./context";
import { TurboEdgeAsset } from "./graph-assets/turbo-edge";
import TurboNode from "./graph-assets/turbo-node";
import { FlowGraphProps, FlowNameMapper } from "./type";


import { createComponent, disableComponent, updateComponent } from "@/api-helpers/component-api";
import { getComponentOpts, getCustomComponents, getSysprompts } from "@/api-helpers/master-api";
import { ComponentOpt, FlowType, ICustomCompData, IFlowNode, IReportCompData, SysPromptOpt } from "@/interface/flow";

import './graph-assets/turbo-elements.css';
import './flow-editor.css';

const nodeType: NodeTypes = { turbo: TurboNode };
const UNREMOVABLE_TYPES: FlowType[] = ['Input', 'Output'];

interface ModalProps<T> {
    visible: boolean;
    onClose: () => void;
    defaultValues?: T
}

function PromptModal(props: ModalProps<IFlowNode>) {
    const { visible, defaultValues, onClose } = props;
    const { graphRef, inEdit, componentOpts, sysPromptOpts } = useFlowGrapContext();
    const [form, setForm] = useState<FormInstance<IFlowNode>>();
    const [isCSV, setIsCSV] = useState<boolean>();

    useEffect(() => {
        setIsCSV(defaultValues?.apimode === 'csv_prompt')
    }, [defaultValues])

    useEffect(() => {
        if (!isCSV) {
            form?.setValue('syspromptid', undefined);
        }
    }, [isCSV]);

    const onOK = (): void => {
        form?.submit()
            .then(({ id, prompt, name, apimode, syspromptid }) => {
                graphRef?.current?.setNode(id, pre => ({
                    ...pre,
                    data: {
                        ...pre.data,
                        prompt: prompt,
                        name: name,
                        apimode: apimode,
                        syspromptid: syspromptid
                    }
                }))
                onClose?.();
            }).catch(() => {
                // 
            });
    }

    return (
        <Modal
            title="Set the prompt"
            onOk={inEdit ? onOK : undefined}
            onCancel={onClose}
            cancelLabel={inEdit ? undefined : 'Close'}
            visible={visible}
        >
            <Form
                readonly={!inEdit}
                defaultValues={defaultValues}
                onLoad={_form => setForm(_form)}
                onDestroyed={() => setForm(undefined)}>{
                    ({ Item }) =>
                        <>
                            <Item name='apimode' label="API Mode" rules={{ required: 'Please select an API mode!' }}>
                                <Dropdown
                                    options={componentOpts?.filter(i => i.COMP_TYPE === 'Normal').map(i => ({ label: i.COMP_NAME, value: i.APIMODE }))}
                                    onChange={(e) => {
                                        setIsCSV(e.value === 'csv_prompt');
                                    }}
                                />
                            </Item>
                            {
                                isCSV && <Item name='syspromptid' label="System Prompt">
                                    <Dropdown
                                        options={sysPromptOpts?.map(i => ({ label: `${i.PROMPT_ID}-${i.PROMPT_NAME}`, value: i.PROMPT_ID }))}
                                        onChange={e => {
                                            const opt = find(sysPromptOpts, i => i.PROMPT_ID === e.value);
                                            if (!opt) return;
                                            form?.setValue('name', opt.PROMPT_NAME);
                                            form?.setValue('prompt', opt.PROMPT_CONTENT);
                                        }}
                                    />
                                </Item>
                            }
                            <Item name='name' label="Name" >
                                <InputText />
                            </Item>
                            <Item name='prompt' label="Prompt" >
                                <InputTextarea autoResize className="w-full min-h-[100px]" />
                            </Item>
                        </>
                }
            </Form>
        </Modal>)
}

function WorkflowModal(props: ModalProps<IFlowNode>) {
    const { visible, defaultValues, onClose } = props;
    const { flowNameMapper, inEdit, graphRef } = useFlowGrapContext()
    const [form, setForm] = useState<FormInstance<IFlowNode>>()
    const onOK = (): void => {
        form?.submit()
            .then(({ id, workflowid }) => {
                graphRef?.current?.setNode(id, pre => ({
                    ...pre,
                    data: {
                        ...pre.data,
                        workflowid: workflowid,
                        workflowstatus: 'enable'
                    }
                }))
                onClose?.();
            }).catch(() => {
                // 
            });
    };

    return (
        <Modal
            title="Workflow Reference"
            onOk={inEdit ? onOK : undefined}
            onCancel={onClose}
            cancelLabel={inEdit ? undefined : 'Close'}
            visible={visible}
        >
            <Form
                readonly={!inEdit}
                defaultValues={defaultValues}
                onLoad={form => setForm(form)}
                onDestroyed={() => setForm(undefined)}>
                {
                    ({ Item }) =>
                    (<>
                        <Item name='workflowid' label="Select a reference workflow" >
                            <Dropdown disabled options={map<FlowNameMapper, SelectItem>(flowNameMapper, (v, k) => ({ label: v, value: k }))} />
                        </Item>
                    </>)
                }
            </Form>
        </Modal>
    )

}

function ReportModal(props: ModalProps<IFlowNode>) {
    const { visible, defaultValues, onClose } = props;
    const { componentOpts, graphRef, inEdit } = useFlowGrapContext();
    const [form, setForm] = useState<FormInstance<IFlowNode>>()
    const onOK = (): void => {
        form?.submit()
            .then(({ id, prompt, name, apimode }) => {
                graphRef?.current?.setNode(id, pre => ({
                    ...pre,
                    data: {
                        ...pre.data,
                        prompt: prompt,
                        name: name,
                        apimode: apimode
                    }
                }));
                onClose?.();
            }).catch(() => {
                // 
            });
    };

    return (
        <Modal
            title="Set the report link"
            onOk={inEdit ? onOK : undefined}
            onCancel={onClose}
            cancelLabel={inEdit ? undefined : 'Close'}
            visible={visible}
        >
            <Form
                readonly={!inEdit}
                defaultValues={defaultValues}
                onLoad={form => setForm(form)}
                onDestroyed={() => setForm(undefined)}>{
                    ({ Item }) =>
                        <>
                            <Item name='apimode' label="API Mode" disabled defaultValue={'report'}>
                                <Dropdown options={componentOpts?.filter(i => i.COMP_TYPE === 'Report').map(i => ({ label: i.COMP_NAME, value: i.APIMODE }))} />
                            </Item>
                            <Item name='name' label="Name" >
                                <InputText />
                            </Item>
                            <Item name='prompt' label="Prompt" >
                                <InputTextarea autoResize className="w-full min-h-[100px]" />
                            </Item>
                        </>
                }
            </Form>
        </Modal>
    )
}

function AddComponent(props: ModalProps<ICustomCompData>) {
    const { visible, onClose } = props;
    const { componentOpts, onAddComponent, customComps, sysPromptOpts } = useFlowGrapContext();
    const [form, setForm] = useState<FormInstance<ICustomCompData>>();
    const [isCSV, setIsCSV] = useState<boolean>(false)
    const onOK = (): void => {
        form?.submit()
            .then(async (val) => {
                const component_opt = find(componentOpts, c => c.APIMODE == val.apimode);
                if (!component_opt) throw Error('not the such component option')
                await onAddComponent?.({
                    ...val,
                    id: '',
                    comp_name: component_opt.COMP_NAME,
                    comp_type: 'Normal',
                    owner: 'user',
                    user: 'user'
                })
                onClose?.();
            }).catch(() => {
                // 
            });
    };

    useEffect(() => {
        if (!isCSV) {
            form?.setValue('syspromptid', undefined);
        }
    }, [isCSV])

    return (
        <Modal
            title="Add a new component"
            onOk={onOK}
            onCancel={onClose}
            okLabel="Add"
            cancelLabel={'Close'}
            visible={visible}
        >
            <Form
                onLoad={(form: FormInstance<ICustomCompData>) => setForm(form)}
                onDestroyed={() => setForm(undefined)}>{
                    ({ Item }) =>
                        <>
                            <Item name='apimode' label="API Mode" rules={
                                {
                                    required: 'API Mode is required!',
                                }
                            }>
                                <Dropdown options={componentOpts?.map(i => ({ label: i.COMP_NAME, value: i.APIMODE }))}
                                    onChange={(e) => {
                                        setIsCSV(e.value === 'csv_prompt');
                                    }}
                                />
                            </Item>
                            {
                                isCSV && <Item name='syspromptid' label="System Prompt">
                                    <Dropdown options={sysPromptOpts?.map(i => ({ label: `${i.PROMPT_ID}-${i.PROMPT_NAME}`, value: i.PROMPT_ID }))}
                                        onChange={e => {
                                            const opt = find(sysPromptOpts, i => i.PROMPT_ID === e.value);
                                            if (!opt) return;
                                            form?.setValue('name', opt.PROMPT_NAME);
                                            form?.setValue('prompt', opt.PROMPT_CONTENT);
                                        }}
                                    />
                                </Item>
                            }
                            <Item name='name' label="Name" rules={
                                {
                                    required: 'Component name is required!',
                                    validate: {
                                        value: (v) => {
                                            return !includes(
                                                customComps?.map(i => i.name), v
                                            ) || 'The component name should not repeat!'
                                        },
                                    }
                                }
                            }>
                                <InputText />
                            </Item>
                            <Item name='prompt' label="Prompt"  >
                                <InputTextarea autoResize className="w-full min-h-[100px]" />
                            </Item>
                        </>
                }
            </Form>
        </Modal>
    )
}

function EditComponent(props: ModalProps<ICustomCompData>) {
    const { visible, onClose, defaultValues, } = props;
    const { componentOpts, onDeleteComponent, onEditComponent, customComps, sysPromptOpts } = useFlowGrapContext();
    const [form, setForm] = useState<FormInstance<ICustomCompData>>();
    const [isCSV, setIsCSV] = useState<boolean>();

    useEffect(() => {
        setIsCSV(defaultValues?.apimode === 'csv_prompt')
    }, [defaultValues])

    useEffect(() => {
        if (!isCSV) {
            form?.setValue('syspromptid', undefined);
        }
    }, [isCSV]);

    const onOK = (): void => {
        form?.submit()
            .then(async (val) => {
                await onEditComponent?.({
                    ...defaultValues,
                    ...val,
                    user: 'user'
                })
                onClose?.();
            }).catch(() => {
                // 
            });
    };

    return (
        <Modal
            title="Edit component"
            onOk={onOK}
            onCancel={onClose}
            cancelLabel={'Close'}
            okLabel="Save"
            visible={visible}
            footerPrefix={
                <Button
                    icon={<FontAwesomeIcon className="mr-[7px]" icon={faTrash} />}
                    severity='danger'
                    onClick={() => {
                        if (!defaultValues) return;
                        confirmDialog({
                            position: 'top',
                            message: `Do you want to delete ${defaultValues?.name || 'this component'}?`,
                            header: `Delete Component`,
                            icon: 'pi pi-info-circle',
                            acceptClassName: 'p-button-danger',
                            accept: async () => {
                                await onDeleteComponent?.(defaultValues);
                                onClose?.();
                            },
                        });

                    }}>
                    Delete
                </Button>}
        >
            <Form
                defaultValues={defaultValues}
                onLoad={(form: FormInstance<ICustomCompData>) => setForm(form)}
                onDestroyed={() => setForm(undefined)}>{
                    ({ Item }) =>
                        <>
                            <Item name='apimode' label="API Mode" rules={
                                {
                                    required: 'API Mode is required!',
                                }
                            }>
                                <Dropdown
                                    options={componentOpts?.map(i => ({ label: i.COMP_NAME, value: i.APIMODE }))}
                                    onChange={(e) => {
                                        setIsCSV(e.value === 'csv_prompt');
                                    }}
                                />
                            </Item>
                            {
                                isCSV && <Item name='syspromptid' label="System Prompt">
                                    <Dropdown options={sysPromptOpts?.map(i => ({ label: `${i.PROMPT_ID}-${i.PROMPT_NAME}`, value: i.PROMPT_ID }))}
                                        onChange={e => {
                                            const opt = find(sysPromptOpts, i => i.PROMPT_ID === e.value);
                                            if (!opt) return;
                                            form?.setValue('name', opt.PROMPT_NAME);
                                            form?.setValue('prompt', opt.PROMPT_CONTENT);
                                        }}
                                    />
                                </Item>
                            }
                            <Item name='name' label="Name" rules={
                                {
                                    required: 'Component name is required!',
                                    validate: {
                                        value: (v, formV) => {
                                            return !includes(
                                                customComps?.filter(i => i.id !== formV.id)?.map(i => i.name), v
                                            ) || 'The component name should not repeat!'
                                        },
                                    }
                                }
                            }>
                                <InputText />
                            </Item>
                            <Item name='prompt' label="Prompt" >
                                <InputTextarea autoResize className="w-full min-h-[100px]" />
                            </Item>
                        </>
                }
            </Form>
        </Modal >
    )
}

function ActionBtns(props: FlowGraphProps) {

    const {
        inEdit,
        customComps,
        componentOpts,
        selectedGroup,
        setSelectedGroup,
        setEditComp,
        setOnDragItem,
        setAddComp
    } = useFlowGrapContext();

    const comp_group_ref = useRef<HTMLDivElement>(null);
    const position = comp_group_ref.current?.getBoundingClientRect();
    const [compGroups, setCompGroups] = useState<Dictionary<ICustomCompData[]>>({});

    useEffect(() => {
        setSelectedGroup(undefined)
    }, [inEdit]);

    useEffect(() => {
        setSelectedGroup(pre => some(customComps, i => i.apimode === pre) ? pre : undefined)
        setCompGroups(groupBy(customComps, i => i.apimode))
    }, [customComps]);

    return (
        <>
            <Tooltip target={'.actbar-tooltip'} position='top' />
            <DndList
                className="w-max-[162px]"
                items={GET_REPORT_COMPONENTS(props)}
                disableChangeOrder
                renderContent={(data) => <ReportComponent {...data} />}
                onDragStart={(init, item): void => {
                    setOnDragItem(() => item)
                }}
                direction='horizontal'
            />
            <Divider className="h-[40px] mx-[4px] " color="red" layout='vertical' />
            <DndList
                className="shrink overflow-auto no-scrollbar"
                items={keys(compGroups)}
                ref={comp_group_ref}
                disableChangeOrder
                isDragDisabled
                renderContent={(apimode: string) => {
                    const comp = find(componentOpts, c => c.APIMODE === apimode)
                    return <CustomComponentGroup comp={comp} />
                }}
                direction='horizontal'
            />
            <AddButton onClick={() => setAddComp(true)} />
            {!!selectedGroup &&
                <div className={`fixed act-bar !h-fit !w-fit py-0 px-2`}
                    style={{
                        left: position?.x,
                        top: (position?.y || 0) + 70
                    }}
                >
                    <DndList
                        items={compGroups[selectedGroup] || []}
                        renderContent={(data: ICustomCompData) => (
                            <CustomComponent
                                {...data}
                                onClick={(comp) => {
                                    setEditComp(comp)
                                }}
                            />)}
                        onDragStart={(init, item): void => {
                            setOnDragItem(item)
                        }}
                        direction='horizontal'
                    />
                </div>
            }
        </>
    )
}

export default function FlowEditor(props: FlowGraphProps) {

    const {
        flows,
        inEdit = false,
        graphRef: ref,
        delayRender,
        actionBarContent,
        actionBarClass,
        loading,
        ...others
    } = props

    const { graphRef } = useGraphRef<IFlowNode, any>(ref);
    const [initialEdges, setInitialEdges] = useState<Edge<any>[]>([]);
    const [initialNodes, setInitialNodes] = useState<Node<IFlowNode>[]>([]);
    const [openModal, setOpenModal] = useState<IFlowNode>();
    const [addComp, setAddComp] = useState<boolean>(false);
    const [onDragItem, setOnDragItem] = useState<IReportCompData | ICustomCompData>();
    const [editComp, setEditComp] = useState<ICustomCompData>();
    const [selectedGroup, setSelectedGroup] = useState<string>();
    const [componentOpts, setComponentOpts] = useState<ComponentOpt[]>([]);
    const [customComps, setCustomComps] = useState<ICustomCompData[]>([]);
    const [sysPromptOpts, setSysPromptOpts] = useState<SysPromptOpt[]>([]);

    const clickOnSetting = (flow: IFlowNode) => {
        setOpenModal(flow)
    }

    const closeModal = () => { setOpenModal(undefined) }

    const onAddComponent = async (comp: ICustomCompData) => {
        await createComponent(comp);
        await fetchCustomComps();
    }
    const onEditComponent = async (comp: ICustomCompData) => {
        await updateComponent(comp);
        await fetchCustomComps()
    }
    const onDeleteComponent = async ({ id }: ICustomCompData) => {
        await disableComponent(id);
        await fetchCustomComps()
    }

    const fetchComponentOpts = async () => {
        const opts = await getComponentOpts();
        setComponentOpts(opts)
    }
    const fetchCustomComps = async () => {
        const comps = await getCustomComponents();
        setCustomComps(comps);
    }
    const fetchSysPromptOpts = async () => {
        const sys_prompts = await getSysprompts();
        setSysPromptOpts(sys_prompts);
    }

    const initial = async () => {
        fetchComponentOpts();
        fetchCustomComps();
        fetchSysPromptOpts();
    };

    useEffect(() => {
        initial()
    }, []);

    useEffect(() => {
        const edges: Edge[] = [];
        const nodes = map<IFlowNode, Node<IFlowNode>>(flows, flow => {
            const { id, position, forwards } = flow;
            forEach(forwards, fw => {
                edges.push({ id: `${flow.id}-${fw}`, source: flow.id, target: fw, deletable: inEdit })
            })
            return ({
                id,
                position,
                type: 'turbo',
                data: flow,
                selectable: inEdit,
                deletable: !includes(UNREMOVABLE_TYPES, flow.type)
            })
        });
        setInitialEdges(edges);
        setInitialNodes(nodes);
        setTimeout(() => {
            graphRef.current?.resetAllElements(nodes, edges);
        }, delayRender);
    }, [flows]);

    useEffect(() => {
        graphRef.current?.setNodes(n => ({ ...n, selectable: inEdit, selected: false }));
        graphRef.current?.setEdges(e => ({ ...e, deletable: inEdit, selected: false, }));
    }, [inEdit]);

    return (
        <ErrorBoundary>
            <FlowGrapContext.Provider
                value={{
                    ...props,
                    clickOnSetting,
                    graphRef,
                    onAddComponent,
                    onEditComponent,
                    onDeleteComponent,
                    selectedGroup,
                    setSelectedGroup,
                    componentOpts,
                    customComps,
                    sysPromptOpts,
                    setEditComp,
                    setOnDragItem,
                    setAddComp,
                }}>

                <div className="flow-editor h-full w-full relative rounded-std overflow-hidden">
                    <LoadingPane loading={loading} className="border-none" title="Fetching flow..." >
                        {actionBarContent ?
                            (
                                <div className={`act-bar main top-[22px] ${actionBarClass || ''}`} >
                                    {
                                        typeof actionBarContent === 'function' ?
                                            actionBarContent(props, <div className="flex-h-center"><ActionBtns {...props} /></div>) :
                                            actionBarContent
                                    }
                                </div>
                            ) :
                            (inEdit && <div className={`act-bar main h-[68px] top-[22px]`} > <ActionBtns {...props} /> </div>)
                        }
                        <Graph
                            initialEdges={initialEdges}
                            initialNodes={initialNodes}
                            className=" bg-deep"
                            nodeTypes={nodeType}
                            defaultEdgeOptions={EDGE_DEF_SETTING}
                            readonly={!inEdit}
                            graphRef={graphRef}
                            onConnect={(connection: Connection) => {
                                const { source, target } = connection
                                if (!source || !target) return;
                                const id = `${source}=${target}`
                                graphRef?.current?.addEdge({ id, source, target, ...EDGE_DEF_SETTING });
                                graphRef?.current?.setNode(source, (pre) => {
                                    pre.data.forwards?.push(target);
                                    return pre
                                })
                            }}
                            onEdgesDelete={(e) => {
                                const edge = e[0];
                                if (!edge) return;
                                const { source, target } = edge;
                                graphRef.current?.setNode(source, pre => {
                                    if (!pre.data.forwards) return pre
                                    const idx = pre.data.forwards?.indexOf(target);
                                    pre.data.forwards.splice(idx, 1);
                                    return pre
                                })
                            }}
                            onNodesChange={(changes) => {
                                const change = find(changes, ['type', 'remove'])
                                if (!!change) {
                                    const { id } = change as NodeRemoveChange;
                                    graphRef.current?.setNodes(pre => {
                                        if (!pre.data.forwards?.includes(id)) return pre;
                                        const idx = pre.data.forwards.indexOf(id);
                                        pre.data.forwards.splice(idx, 1);
                                        return pre
                                    })
                                }
                            }}
                            onMouseUp={(e, position) => {
                                if (!onDragItem || !position) return;
                                const id = `tmp_${v4()}`;
                                const { comp_type, ...others } = onDragItem
                                graphRef.current?.addNode({
                                    id, position,
                                    data: {
                                        ...others,
                                        type: comp_type,
                                        id, position, forwards: []
                                    }, type: 'turbo'
                                });
                                setOnDragItem(() => undefined);
                            }}
                            fitView
                            {...others}
                        >
                            <TurboEdgeAsset />
                        </Graph>
                        {/* Customize Prompt Modal */}
                        <PromptModal
                            visible={openModal?.type === 'Normal'}
                            onClose={closeModal}
                            defaultValues={openModal}
                        />
                        {/* Workflow Ref Modal */}
                        <WorkflowModal
                            visible={openModal?.type === 'Workflow'}
                            onClose={closeModal}
                            defaultValues={openModal}
                        />
                        {/* Report Link Modal */}
                        <ReportModal
                            visible={openModal?.type === 'Report'}
                            onClose={closeModal}
                            defaultValues={openModal}
                        />
                        <AddComponent
                            visible={addComp}
                            onClose={() => setAddComp(false)}
                        />
                        <EditComponent
                            visible={!!editComp}
                            defaultValues={editComp}
                            onClose={() => setEditComp(undefined)}
                        />
                    </LoadingPane>
                </div>
            </FlowGrapContext.Provider>
        </ErrorBoundary >
    )
}

