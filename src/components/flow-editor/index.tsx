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
import Graph from "../graph";
import { useGraphRef } from "../graph/helper";
import Modal from "../modal";

import AddButton from "./actbar-assets/add-button";
import CustomModule from "./actbar-assets/custom-module";
import CustomModuleGroup from "./actbar-assets/custom-module-group";
import ReportModule from "./actbar-assets/report-module";
import { EDGE_DEF_SETTING, GET_REPORT_MODULE } from "./configuration";
import { FlowGrapContext, useFlowGrapContext } from "./context";
import { TurboEdgeAsset } from "./graph-assets/turbo-edge";
import TurboNode from "./graph-assets/turbo-node";
import { FlowGraphProps, FlowNameMapper } from "./type";


import { FlowType, IFlowNode, IReportModule } from "@/interface/flow";

import './graph-assets/turbo-elements.css';
import './flow-editor.css';

const nodeType: NodeTypes = { turbo: TurboNode };
const UNREMOVABLE_TYPES: FlowType[] = ['Input', 'Output'];

interface ModalProps<T> {
    inEdit: boolean;
    visible: boolean;
    onClose: () => void;
    onSave: (val: T) => void
    defaultValues?: T
}

function PromptModal(props: ModalProps<IFlowNode>) {
    const { visible, inEdit, defaultValues, onSave, onClose } = props;
    const { componentData } = useFlowGrapContext();
    const [form, setForm] = useState<FormInstance<IFlowNode>>()
    const onOK = (): void => {
        form?.submit()
            .then((val) => {
                onSave(val)
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
                                <Dropdown options={componentData?.filter(i => i.COMP_TYPE === 'Normal').map(i => ({ label: i.COMP_NAME, value: i.APIMODE }))} />
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
        </Modal>)
}

function WorkflowModal(props: ModalProps<IFlowNode>) {
    const { visible, inEdit, defaultValues, onSave, onClose } = props;
    const { flowNameMapper } = useFlowGrapContext()
    const [form, setForm] = useState<FormInstance<IFlowNode>>()
    const onOK = (): void => {
        form?.submit()
            .then((val) => {
                onSave(val);
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
    const { visible, inEdit, defaultValues, onSave, onClose } = props;
    const { componentData } = useFlowGrapContext();
    const [form, setForm] = useState<FormInstance<IFlowNode>>()
    const onOK = (): void => {
        form?.submit()
            .then((val) => {
                onSave(val);
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
                                <Dropdown options={componentData?.filter(i => i.COMP_TYPE === 'Report').map(i => ({ label: i.COMP_NAME, value: i.APIMODE }))} />
                            </Item>
                            <Item name='fileName' label="File" >
                                <Dropdown options={['file_1', 'file_2']} />
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

function AddModule(props: ModalProps<IReportModule>) {
    const { visible, onSave, onClose } = props;
    const { componentData } = useFlowGrapContext();
    const [form, setForm] = useState<FormInstance<IReportModule>>()
    const onOK = (): void => {
        form?.submit()
            .then((val) => {
                onSave(val);
                onClose?.();
            }).catch(() => {
                // 
            });
    };
    return (
        <Modal
            title="Add a new module"
            onOk={onOK}
            onCancel={onClose}
            okLabel="Add"
            cancelLabel={'Close'}
            visible={visible}
        >
            <Form
                onLoad={(form: FormInstance<IReportModule>) => setForm(form)}
                onDestroyed={() => setForm(undefined)}>{
                    ({ Item }) =>
                        <>
                            <Item name='apimode' label="API Mode">
                                <Dropdown options={componentData?.map(i => ({ label: i.COMP_NAME, value: i.APIMODE }))} />
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

function EditModule(props: ModalProps<IReportModule> & { onDelete?: (val: IReportModule) => void }) {
    const { visible, onSave, onClose, defaultValues, onDelete } = props;
    const { componentData } = useFlowGrapContext();
    const [form, setForm] = useState<FormInstance<IReportModule>>()
    const onOK = (): void => {
        form?.submit()
            .then((val) => {
                onSave(val);
                onClose?.();
            }).catch(() => {
                // 
            });
    };
    return (
        <Modal
            title="Edit module"
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
                            message: `Do you want to delete ${defaultValues?.name || 'this module'}?`,
                            header: `Delete Module`,
                            icon: 'pi pi-info-circle',
                            acceptClassName: 'p-button-danger',
                            accept: async () => {
                                onDelete?.(defaultValues);
                                onClose?.();
                            },
                        });

                    }}>
                    Delete
                </Button>}
        >
            <Form
                defaultValues={defaultValues}
                onLoad={(form: FormInstance<IReportModule>) => setForm(form)}
                onDestroyed={() => setForm(undefined)}>{
                    ({ Item }) =>
                        <>
                            <Item name='apimode' label="API Mode">
                                <Dropdown options={componentData?.map(i => ({ label: i.COMP_NAME, value: i.APIMODE }))} />
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

export default function FlowEditor(props: FlowGraphProps) {

    const {
        flows,
        inEdit = false,
        graphRef: ref,
        flowNameMapper,
        delayRender,
        componentData,
        modules,
        onAddModule,
        onEditModule,
        onDeleteModule,
        ...others
    } = props

    const { graphRef } = useGraphRef<IFlowNode, any>(ref);
    const module_group_ref = useRef<HTMLDivElement>(null);
    const [onDragItem, setOnDragItem] = useState<IReportModule>();
    const [initialEdges, setInitialEdges] = useState<Edge<any>[]>([]);
    const [initialNodes, setInitialNodes] = useState<Node<IFlowNode>[]>([]);
    const [openModal, setOpenModal] = useState<IFlowNode>();
    const [addModule, setAddModule] = useState<boolean>(false);
    const [editModule, setEditModule] = useState<IReportModule>();
    const [moduleGroups, setModuleGroups] = useState<Dictionary<IReportModule[]>>({});
    const [selectedGroup, setSelectedGroup] = useState<string>();

    const clickOnSetting = (flow: IFlowNode) => {
        setOpenModal(flow)
    }

    const closeModal = () => { setOpenModal(undefined) }

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
            graphRef.current.resetAllElements(nodes, edges);
        }, delayRender);
    }, [flows]);

    useEffect(() => {
        setSelectedGroup(undefined)
        graphRef.current.setNodes(n => ({ ...n, selectable: inEdit, selected: false }));
        graphRef.current.setEdges(e => ({ ...e, deletable: inEdit, selected: false, }));
    }, [inEdit]);

    useEffect(() => {
        setSelectedGroup(pre => some(modules, i => i.apimode === pre) ? pre : undefined)
        setModuleGroups(groupBy(modules, 'apimode'))
    }, [modules])

    return (
        <ErrorBoundary>
            <FlowGrapContext.Provider
                value={{
                    inEdit,
                    clickOnSetting,
                    flowNameMapper,
                    componentData,
                    graphRef,
                    selectedGroup,
                    setSelectedGroup
                }}>
                <div className="flow-editor h-full w-full relative">
                    <Tooltip target={'.actbar-tooltip'} position='top' />
                    {inEdit &&
                        (<>
                            <div className={`act-bar main top-[22px]`} >
                                <DndList
                                    className="w-[162px]"
                                    items={GET_REPORT_MODULE(props)}
                                    disableChangeOrder
                                    renderContent={(data) => <ReportModule {...data} />}
                                    onDragStart={(init, item): void => {
                                        setOnDragItem(() => item)
                                    }}
                                    direction='horizontal'
                                />
                                <Divider className="h-[40px] mx-[4px] " color="red" layout='vertical' />
                                <DndList
                                    className="grow shrink overflow-auto no-scrollbar"
                                    items={keys(moduleGroups)}
                                    ref={module_group_ref}
                                    disableChangeOrder
                                    isDragDisabled
                                    renderContent={(apimode: string) => {
                                        const comp = find(componentData, c => c.APIMODE === apimode)
                                        return <CustomModuleGroup comp={comp} />
                                    }}
                                    direction='horizontal'
                                />
                                <AddButton onClick={() => setAddModule(true)} />
                            </div>
                            {!!selectedGroup &&
                                <div className={`act-bar !w-fit top-[100px]`}
                                    style={{
                                        left:
                                            (module_group_ref.current?.offsetLeft || 0) + (module_group_ref.current?.parentElement?.offsetLeft || 0)
                                    }}>
                                    <DndList
                                        items={moduleGroups[selectedGroup] || []}

                                        renderContent={(data: IReportModule) => (
                                            <CustomModule
                                                {...data}
                                                onClick={(module) => {
                                                    setEditModule(module)
                                                }}
                                            />)}
                                        onDragStart={(init, item): void => {
                                            setOnDragItem(() => item)
                                        }}
                                        direction='horizontal'
                                    />
                                </div>
                            }
                        </>)
                    }
                    <Graph
                        initialEdges={initialEdges}
                        initialNodes={initialNodes}
                        className="rounded-std bg-deep"
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
                            graphRef.current.setNode(source, pre => {
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
                                graphRef.current.setNodes(pre => {
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
                            graphRef.current?.addNode({
                                id, position,
                                data: {
                                    ...onDragItem,
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
                        inEdit={inEdit}
                        visible={openModal?.type === 'Normal'}
                        onClose={closeModal}
                        onSave={({ id, prompt, name, apimode }) => {
                            graphRef.current.setNode(id, pre => ({
                                ...pre,
                                data: {
                                    ...pre.data,
                                    prompt: prompt,
                                    name: name,
                                    apimode: apimode
                                }
                            }))
                        }}
                        defaultValues={openModal}
                    />
                    {/* Workflow Ref Modal */}
                    <WorkflowModal
                        inEdit={inEdit}
                        visible={openModal?.type === 'Workflow'}
                        onClose={closeModal}
                        onSave={({ id, workflowid }) => {
                            graphRef.current.setNode(id, pre => ({
                                ...pre,
                                data: {
                                    ...pre.data,
                                    workflowid: workflowid,
                                    workflowstatus: 'enable'
                                }
                            }))
                        }}
                        defaultValues={openModal}
                    />
                    {/* Report Link Modal */}
                    <ReportModal
                        inEdit={inEdit}
                        visible={openModal?.type === 'Report'}
                        onClose={closeModal}
                        onSave={({ id, prompt, name, fileName, apimode }) => {
                            graphRef.current.setNode(id, pre => ({
                                ...pre,
                                data: {
                                    ...pre.data,
                                    prompt: prompt,
                                    name: name,
                                    fileName: fileName,
                                    apimode: apimode
                                }
                            }));
                        }}
                        defaultValues={openModal}
                    />
                    <AddModule
                        inEdit={true}
                        visible={addModule}
                        onClose={() => setAddModule(false)}
                        onSave={(val) => {
                            onAddModule?.({ ...val, type: 'Normal' })
                        }}
                    />
                    <EditModule
                        inEdit={true}
                        visible={!!editModule}
                        defaultValues={editModule}
                        onClose={() => setEditModule(undefined)}
                        onSave={(val) => {
                            onEditModule?.(val)
                        }}
                        onDelete={onDeleteModule}
                    />
                </div>
            </FlowGrapContext.Provider>
        </ErrorBoundary >
    )
}

