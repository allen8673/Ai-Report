'use client'
import { faEye } from '@fortawesome/free-solid-svg-icons';
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
import FileUploader from '@/components/file-uploader';
import { ifWorkflowIsCompleted } from '@/components/flow-editor/helper';
import Modal from '@/components/modal';
import { ApiResult } from '@/interface/api';
import { IJob } from '@/interface/job';
import { IWorkflow } from '@/interface/workflow';

interface ViewReports {
    workflowId: string;
    jobs: IJob[];
}

export default function WorkflowLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { showMessage } = useLayoutContext();

    const [runningWF, setRunningWF] = useState<IWorkflow>();
    const [reportJobs, setReportJobs] = useState<ViewReports>();
    const [selectedJob, setSelectedJob] = useState<{ id: string, contenet?: any }>();

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
                setSelectedJob({ id: res.data.data?.[0]?.JOB_ID || '' })
                // setSelectedJob(() => res.data.data?.[0]?.JOB_ID)
                setReportJobs(() => {
                    return { workflowId, jobs: res.data.data || [] };
                })
            }).catch((error) => {
                showMessage({
                    message: toString(error),
                    type: 'error'
                })
            })
    }
    useEffect(() => {
        if (!selectedJob?.id) return;
        apiCaller.get<ApiResult<IJob[]>>(`${process.env.NEXT_PUBLIC_DOWNLOAD}/${selectedJob.id}/`)
            .then(res => {
                console.log(res)
            }).catch((error) => {
                showMessage({
                    message: toString(error),
                    type: 'error'
                })
            })

    }, [selectedJob?.id])

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
            <Modal
                className="preview-doc-moda min-w-[50%] min-h-[50%]"
                onOk={() => setReportJobs(undefined)}
                okLabel="Close"
                visible={!!reportJobs}
                contentClassName="flex flex-col gap-[22px] ovre"
                footerClass="flex justify-end"
            >
                <div className='flex gap-[7px]'>
                    <Dropdown
                        className='grow'
                        value={selectedJob}
                        options={map<IJob, SelectItem>(reportJobs?.jobs || [], ({ JOB_ID }) => ({ label: JOB_ID, value: JOB_ID }))}
                        onChange={v => { setSelectedJob(v.value) }}
                    />
                    <Button severity='info' label={'Preview'} icon={<FontAwesomeIcon icon={faEye} />} />
                    <Button label={'Download'} icon={<FontAwesomeIcon icon={faDownload} />} />
                </div>
                <Fieldset legend="Preview your report" className="grow" >
                    {/* {openModal?.report || ''} */}
                </Fieldset>
            </Modal>
        </WfLayoutContext.Provider>
    )
}