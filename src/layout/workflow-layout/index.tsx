'use client'
import { faDownload } from '@fortawesome/free-solid-svg-icons/faDownload';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { map, toString } from 'lodash';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Fieldset } from 'primereact/fieldset';
import { SelectItem } from 'primereact/selectitem';
import React, { useEffect, useState } from 'react'

import { useLayoutContext } from '../turbo-layout/context';

import { WfLayoutContext } from './context';

import apiCaller from '@/api-helpers/api-caller';
import EmptyPane from '@/components/empty-pane';
import FileUploader from '@/components/file-uploader';
import { ifWorkflowIsCompleted } from '@/components/flow-editor/helper';
import Modal from '@/components/modal';
import { ApiResult } from '@/interface/api';
import { IJob } from '@/interface/job';
import { IWorkflow } from '@/interface/workflow';
import { downloadString } from '@/utils';

interface ViewReports {
    workflowId: string;
    jobs: IJob[];
}

const mock: IJob = {
    JOB_ID: '7daf04d4-482a-47e7-b6c7-e8b680549ea4',
    WORKFLOW_ID: '',
    VERSION: 0,
    Create_User: '',
    Create_Time: '',
    Modify_User: '',
    Modify_Time: '',
    STATUS: 'fihish'
}

function PreviewModal({ reportJobs, onClose }:
    {
        reportJobs: ViewReports,
        onClose: () => void
    }) {

    const { showMessage } = useLayoutContext();
    const [jobContents, setJobContents] = useState<{ [id: string]: any }>({});
    const [selectedJob, setSelectedJob] = useState<string>('');

    useEffect(() => {
        setSelectedJob(reportJobs.jobs?.[0]?.JOB_ID || '')
    }, [reportJobs])

    useEffect(() => {
        if (!selectedJob || !!jobContents[selectedJob]) return;
        apiCaller.get(`${process.env.NEXT_PUBLIC_DOWNLOAD}/${selectedJob}`)
            .then(res => {
                if (res.data?.status_code === 404) {
                    throw (res.data.detail)
                }
                setJobContents(pre => {
                    pre[selectedJob] = res.data
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
        visible={!!true}
        contentClassName="flex flex-col gap-[22px]"
        footerClass="flex justify-end"
    >
        <div className='flex gap-[7px] p'>
            <Dropdown
                className='grow'
                value={selectedJob}
                options={map<IJob, SelectItem>(reportJobs?.jobs || [], ({ JOB_ID }) => ({ label: JOB_ID, value: JOB_ID }))}
                onChange={v => {
                    setSelectedJob(v.value)
                }}
            />
            <Button
                className="gap-[7px]"
                severity='info'
                label={'Download'}
                disabled={!jobContents[selectedJob]}
                icon={<FontAwesomeIcon icon={faDownload} />}
                onClick={(): void => {
                    if (!jobContents[selectedJob]) return
                    downloadString(jobContents[selectedJob], selectedJob, 'txt')
                }}
            />
        </div>
        {jobContents[selectedJob] ? <Fieldset legend="Preview your report" className="grow" >
            {jobContents[selectedJob]}
        </Fieldset> : <EmptyPane />}

    </Modal>

}

export default function WorkflowLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { showMessage } = useLayoutContext();
    const [runningWF, setRunningWF] = useState<IWorkflow>();
    const [reportJobs, setReportJobs] = useState<ViewReports>();

    const runWorkflow = async (wf?: IWorkflow | string) => {
        if (!wf) return;
        const workflow: IWorkflow | undefined = typeof wf === 'string' ?
            await (await apiCaller.get<ApiResult<IWorkflow>>(`${process.env.NEXT_PUBLIC_FLOW_API}/${wf}`)).data.data
            : wf

        if (!ifWorkflowIsCompleted(workflow?.flows)) {
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
        apiCaller.get<ApiResult<IJob[]>>(`${process.env.NEXT_PUBLIC_GET_JOBS}/${workflowId}/1`)
            .then(res => {
                setReportJobs(() => {
                    return {
                        workflowId, jobs: [mock, ...(res.data.data || [])]
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
        }}>
            {children}
            <Modal
                title="Upload your files"
                visible={!!runningWF}
                onOk={() => setRunningWF(undefined)}
                footerClass="flex justify-end"
                okLabel="Cancel"
            >
                <FileUploader
                    uploadLabel="Upload & Run"
                    onUpload={e => {
                        if (runningWF && e.files && e.files.length > 0) {
                            const formData = new FormData();
                            for (const i in e.files) {
                                formData.append('files', e.files[i])
                            }

                            formData.append('userId', '23224');
                            formData.append('workflowId', runningWF.id);
                            formData.append('version', '1');

                            apiCaller.post<ApiResult>(`${process.env.NEXT_PUBLIC_REPORT}/run`, formData, {
                                headers: {
                                    "Content-Type": "multipart/form-data",
                                    // "x-rapidapi-host": "file-upload8.p.rapidapi.com",
                                    // "x-rapidapi-key": "your-rapidapi-key-here",
                                },
                            }).then((res) => {
                                showMessage({
                                    message: res.data.message || 'success',
                                    type: 'success'
                                })
                                setRunningWF(undefined);
                            }).catch((error) => {
                                showMessage({
                                    message: toString(error),
                                    type: 'error'
                                })
                            });
                        }
                    }}
                />
            </Modal>
            {reportJobs && <PreviewModal reportJobs={reportJobs} onClose={() => setReportJobs(undefined)} />}
        </WfLayoutContext.Provider>
    )
}