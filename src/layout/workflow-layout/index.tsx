'use client'
import { includes, map, toString } from 'lodash';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { SelectItem } from 'primereact/selectitem';
import React, { useEffect, useState } from 'react'

import { useLayoutContext } from '../standard-layout/context';

import { WfLayoutContext } from './context';

import { getFlow } from '@/api-helpers/flow-api';
import { checkJob, downloadJob, getJobs, runReport } from '@/api-helpers/report-api';
import CodeEditor from '@/components/code-editor';
import FileGroupUploader, { useFileGroupUploader } from '@/components/file-group-uploader';
import { FileGroups } from '@/components/file-group-uploader/file-group-uploader';
import { ifFlowIsCompleted } from '@/components/flow-editor/lib';
import Modal from '@/components/modal';
import EmptyPane from '@/components/panes/empty';
import LoadingPane from '@/components/panes/loading';
import { IFlow } from '@/interface/flow';
import { IJob } from '@/interface/job';
import { downloadString } from '@/lib/utils';

interface ViewReports {
    workflowId: string;
    jobs: IJob[];
}

interface RunningWF {
    workflow?: IFlow
    callback?: (jobId: string) => void
}

function PreviewModal({ reportJobs, onClose }:
    {
        reportJobs?: ViewReports,
        onClose: () => void
    }) {

    const { showMessage } = useLayoutContext();
    const [jobContents, setJobContents] = useState<{ [id: string]: string }>({});
    const [selectedJob, setSelectedJob] = useState<string>('');

    useEffect(() => {
        setSelectedJob(reportJobs?.jobs?.[0]?.JOB_ID || '')
    }, [reportJobs])

    useEffect(() => {
        if (!selectedJob || !!jobContents[selectedJob]) return;

        downloadJob(selectedJob)
            .then(data => {
                if (data?.status_code === 404) {
                    throw (data.detail)
                }

                setJobContents(pre => {
                    pre[selectedJob] = typeof data === 'string' ? data : JSON.stringify(data, null, 4)
                    return { ...pre }
                })

            }).catch((error) => {
                showMessage({
                    message: toString(error),
                    type: 'error'
                })
            });
    }, [selectedJob])

    return (
        <Modal
            className="preview-doc-moda min-w-[50%] min-h-[50%] max-w-[70%]"
            onOk={onClose}
            okLabel="Close"
            visible={!!reportJobs}
            contentClassName="flex flex-col gap-[22px]"
            footerClass="flex justify-end"
        >
            <div className='flex-h-center gap-[7px] p'>
                <div className="grow shrink flex-h-center gap-2 ">
                    <h3 className="text-light-weak ">Select finish Job ID:</h3>
                    <Dropdown
                        className='grow'
                        value={selectedJob}
                        options={map<IJob, SelectItem>(reportJobs?.jobs || [], ({ JOB_ID }) => ({ label: JOB_ID, value: JOB_ID }))}
                        onChange={v => {
                            setSelectedJob(v.value);
                        }}
                    />
                </div>
                <Button
                    className="h-[40px]"
                    icon='pi pi-download'
                    severity='info'
                    label={'Download'}
                    disabled={!jobContents[selectedJob]}
                    onClick={(): void => {
                        if (!jobContents[selectedJob]) return
                        downloadString(jobContents[selectedJob], selectedJob, 'txt')
                    }}
                />
            </div>
            <EmptyPane isEmpty={!jobContents[selectedJob]}>
                <CodeEditor
                    hiddenBar
                    language={'text'}
                    className='grow border-solid border-light-weak rounded-std-sm'
                    value={jobContents[selectedJob]}
                    options={{
                        readOnly: true,
                        automaticLayout: true,
                    }}
                />
            </EmptyPane>
        </Modal>
    )
}

function UploadModal({ runningWF, setRunningWF }:
    {
        runningWF?: RunningWF;
        setRunningWF: React.Dispatch<React.SetStateAction<RunningWF | undefined>>
    }) {

    const { uploaderRef } = useFileGroupUploader();
    const { showMessage } = useLayoutContext();

    const [disabledUpload, setDisabledUpload] = useState<boolean>(true);
    const [uploading, setUploading] = useState<boolean>();
    const [jobname, setJobname] = useState<string>();

    useEffect(() => {
        setJobname(pre => !!runningWF ? pre : undefined)
    }, [runningWF])

    const onUpload = (fileGroups: FileGroups) => {
        const files = fileGroups['Upload'];
        if (!runningWF || !runningWF?.workflow || !files?.length) return;
        const formData = new FormData();
        for (const i in files) {
            formData.append('files', files[i])
        }
        formData.append('userId', '23224');
        formData.append('workflowId', runningWF.workflow.id || '');
        formData.append('version', '1');
        if (!!jobname) {
            formData.append('jobname', jobname);
        }

        setUploading(true);
        runReport(formData)
            .then(async (res) => {
                showMessage({
                    message: res.message || 'success',
                    type: 'success'
                })
                await runningWF.callback?.(res.data || '');
                setRunningWF(undefined);
            })
            .catch((error) => {
                showMessage({
                    message: toString(error),
                    type: 'error'
                })
            })
            .finally(() => {
                setDisabledUpload(false);
                setUploading(false);
            });
    }

    const onChange = (fileGroups: FileGroups) => {
        const files = fileGroups['Upload'];
        setDisabledUpload(!files?.length)
    }

    return (<Modal
        title="Upload your files"
        visible={!!runningWF}
        onOk={() => setRunningWF(undefined)}
        footerClass="flex justify-end"
        okLabel="Cancel"
        footerPrefix={
            <Button
                className='custom-upload-btn p-button-rounded p-button-outlined border-2'
                label={'Upload & Run'}
                icon='pi pi-upload'
                style={{ color: '#2a8af6' }}
                loading={uploading}
                onClick={() => {
                    uploaderRef.current.upload()
                }}
                disabled={disabledUpload}
            />
        }
    >
        <LoadingPane className='h-80' title='Checking' loading={!runningWF?.workflow}>
            <div className='flex-h-center gap-2 font-bold mb-2'>
                <label htmlFor='jobname' className="text-light-weak whitespace-nowrap">Job Name:</label>
                <InputText
                    className='w-full'
                    id='jobname'
                    placeholder='Optionally enter a job name for easy identification.'
                    value={jobname}
                    onChange={e => setJobname(e.target.value)}
                />
            </div>
            <FileGroupUploader
                uploaderRef={uploaderRef}
                hideUploadButton
                uploadLabel="Upload & Run"
                grouping={runningWF?.workflow?.flows?.filter(f => includes(['Input', 'Report'], f.type)).sort(a => a.type === 'Input' ? 1 : 0).map(f => f.name || '')}
                onUpload={onUpload}
                onChange={onChange}
            />
        </LoadingPane>
    </Modal>)
}

export default function WorkflowLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { showMessage } = useLayoutContext();
    const [runningWF, setRunningWF] = useState<RunningWF>();
    const [reportJobs, setReportJobs] = useState<ViewReports>();
    const [workflow, setWorkflow] = useState<IFlow>();
    const [fetchingWorkflow, setfetchingWorkflow] = useState<boolean>();

    const runWorkflow = async (wf?: IFlow | string, callback?: (jobId: string) => void) => {
        if (!wf) return;
        setRunningWF({ callback });
        const workflow: IFlow | undefined = typeof wf === 'string' ? await getFlow(wf) : wf;
        const check_res = await checkJob(workflow?.id || '')
        if (check_res.status === 'NG') {
            showMessage({
                message: check_res.message || '',
                type: 'error'
            });
            setRunningWF(undefined);
            return;
        }

        if (!ifFlowIsCompleted(workflow?.flows)) {
            showMessage({
                message: `Cannot run '${workflow?.name}'(${workflow?.id}) since the workflow is not completed.`,
                type: 'error'
            });
            setRunningWF(undefined);
            return;
        }
        setRunningWF(pre => {
            if (!pre) return pre;
            return !!workflow ? { workflow, callback } : undefined
        })
    }

    const viewReports = (workflowId: string) => {
        setReportJobs({ workflowId, jobs: [] });
        getJobs(workflowId)
            .then(res => {
                setReportJobs(() => {
                    return {
                        workflowId, jobs: (res.data || [])
                    };
                })
            }).catch((error) => {
                showMessage({
                    message: toString(error),
                    type: 'error'
                })
            })
    }

    const fetchWorkflow = async (callback: () => (IFlow | undefined | Promise<IFlow | undefined>)) => {
        setfetchingWorkflow(true);
        try {
            const wf = await callback();
            setWorkflow(wf);
        } finally {
            setfetchingWorkflow(false);
        }
    }

    return (
        <WfLayoutContext.Provider value={{
            runWorkflow,
            viewReports,
            workflow,
            fetchWorkflow,
            fetchingWorkflow
        }}>
            {children}
            <UploadModal {...{ runningWF, setRunningWF }} />
            <PreviewModal {...{ reportJobs, onClose: () => setReportJobs(undefined) }} />
        </WfLayoutContext.Provider>
    )
}