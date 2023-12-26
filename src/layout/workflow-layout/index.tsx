'use client'
import { faDownload } from '@fortawesome/free-solid-svg-icons/faDownload';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { map, toString } from 'lodash';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { SelectItem } from 'primereact/selectitem';
import React, { useEffect, useState } from 'react'

import { useLayoutContext } from '../turbo-layout/context';

import { WfLayoutContext } from './context';

import { getFlow } from '@/api-helpers/flow-api';
import { checkJob, downloadJob, getJobs, runReport } from '@/api-helpers/report-api';
import CodeEditor from '@/components/code-editor';
import FileUploader from '@/components/file-uploader';
import { ifFlowIsCompleted } from '@/components/flow-editor/helper';
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
        reportJobs: ViewReports,
        onClose: () => void
    }) {

    const { showMessage } = useLayoutContext();
    const [jobContents, setJobContents] = useState<{ [id: string]: string }>({});
    const [selectedJob, setSelectedJob] = useState<string>('');

    useEffect(() => {
        setSelectedJob(reportJobs.jobs?.[0]?.JOB_ID || '')
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
                    setSelectedJob(v.value);
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
        {/* {jobContents[selectedJob] ? <Fieldset legend="Preview your report" className="grow" >
            {jobContents[selectedJob]}
        </Fieldset> : <EmptyPane />} */}
    </Modal>

}

export default function WorkflowLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { showMessage } = useLayoutContext();
    const [runningWF, setRunningWF] = useState<IFlow>();
    const [reportJobs, setReportJobs] = useState<ViewReports>();

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
                        }
                    }}
                />
            </Modal>
            {reportJobs && <PreviewModal reportJobs={reportJobs} onClose={() => setReportJobs(undefined)} />}
        </WfLayoutContext.Provider>
    )
}