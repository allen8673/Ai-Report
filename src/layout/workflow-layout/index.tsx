'use client'
import { faCloudUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { includes, map, toString } from 'lodash';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { SelectItem } from 'primereact/selectitem';
import React, { useEffect, useState } from 'react'

import { useLayoutContext } from '../standard-layout/context';

import { WfLayoutContext } from './context';

import { getFlow } from '@/api-helpers/flow-api';
import { checkJob, downloadJob, getJobs, runReport } from '@/api-helpers/report-api';
import CodeEditor from '@/components/code-editor';
import FileGroupUploader, { useFileGroupUploader } from '@/components/file-group-uploader';
// import FileUploader from '@/components/file-uploader';
import { ifFlowIsCompleted } from '@/components/flow-editor/lib';
import Modal from '@/components/modal';
import EmptyPane from '@/components/panes/empty';
import { IFlow } from '@/interface/flow';
import { IJob } from '@/interface/job';
import { downloadString } from '@/lib/utils';

interface ViewReports {
    workflowId: string;
    jobs: IJob[];
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

    return <Modal
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
        {jobContents[selectedJob] ?
            <CodeEditor
                hiddenBar
                language={'text'}
                className='grow border-solid border-light-weak rounded-std-sm'
                value={jobContents[selectedJob]}
                options={{
                    readOnly: true,
                    automaticLayout: true,
                }}

            /> :
            <EmptyPane />}
    </Modal>

}

export default function WorkflowLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { showMessage } = useLayoutContext();
    const { uploaderRef } = useFileGroupUploader()
    const [runningWF, setRunningWF] = useState<IFlow>();
    const [reportJobs, setReportJobs] = useState<ViewReports>();
    const [disabledUpload, setDisabledUpload] = useState<boolean>();
    const [cacheWorkflow, setCacheWorkflow] = useState<IFlow>();
    const runWorkflow = async (wf?: IFlow | string) => {
        if (!wf) return;
        const workflow: IFlow | undefined = typeof wf === 'string' ? await getFlow(wf) : wf

        const check_res = await checkJob(workflow?.id || '')
        if (check_res.status === 'NG') {
            showMessage({
                message: check_res.message || '',
                type: 'error'
            })
            return
        }

        if (!ifFlowIsCompleted(workflow?.flows)) {
            showMessage({
                message: `Cannot run '${workflow?.name}'(${workflow?.id}) since the workflow is not completed.`,
                type: 'error'
            })
            return
        }
        setRunningWF(workflow)
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

    return (
        <WfLayoutContext.Provider value={{
            runWorkflow,
            viewReports,
            cacheWorkflow,
            setCacheWorkflow,
        }}>
            {children}
            <Modal
                title="Upload your files"
                visible={!!runningWF}
                onOk={() => setRunningWF(undefined)}
                footerClass="flex justify-end"
                okLabel="Cancel"
                footerPrefix={
                    <Button
                        className='custom-upload-btn p-button-rounded p-button-outlined border-2'
                        label={'Upload & Run'}
                        icon={<FontAwesomeIcon className="w-[18px] h-[18px] p-[3px]" icon={faCloudUpload} />}
                        style={{ color: '#2a8af6' }}
                        onClick={() => {
                            uploaderRef.current.upload()
                        }}
                        disabled={disabledUpload}
                    />
                }
            >
                <FileGroupUploader
                    uploaderRef={uploaderRef}
                    hideUploadButton
                    uploadLabel="Upload & Run"
                    grouping={runningWF?.flows.filter(f => includes(['Input', 'Report'], f.type)).sort(a => a.type === 'Input' ? 1 : 0).map(f => f.name || '')}
                    onUpload={fileGroups => {
                        const files = fileGroups['Upload'];
                        if (!runningWF || !files?.length) return;
                        const formData = new FormData();
                        for (const i in files) {
                            formData.append('files', files[i])
                        }
                        formData.append('userId', '23224');
                        formData.append('workflowId', runningWF.id);
                        formData.append('version', '1');

                        runReport(formData).then((res) => {
                            showMessage({
                                message: res.message || 'success',
                                type: 'success'
                            })
                            setRunningWF(undefined);
                        }).catch((error) => {
                            showMessage({
                                message: toString(error),
                                type: 'error'
                            })
                        });

                    }}
                    onChange={fileGroups => {
                        const files = fileGroups['Upload'];
                        setDisabledUpload(!files?.length)
                    }}
                />
            </Modal>
            <PreviewModal reportJobs={reportJobs} onClose={() => setReportJobs(undefined)} />
        </WfLayoutContext.Provider>
    )
}