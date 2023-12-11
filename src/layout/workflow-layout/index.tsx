'use client'
import { toString } from 'lodash';
import React, { useState } from 'react'

import { useLayoutContext } from '../turbo-layout/context';

import { WfLayoutContext } from './context';

import apiCaller from '@/api-helpers/api-caller';
import FileUploader from '@/components/file-uploader';
import { ifWorkflowIsCompleted } from '@/components/flow-editor/helper';
import Modal from '@/components/modal';
import { ApiResult } from '@/interface/api';
import { IWorkflow } from '@/interface/workflow';

export default function WorkflowLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { showMessage } = useLayoutContext();

    const [runningWF, setRunningWF] = useState<IWorkflow>();

    return (
        <WfLayoutContext.Provider value={{
            runWorkflow: async (wf) => {
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
                            }).then((rep) => {
                                showMessage({
                                    message: rep.data.message || 'success',
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
        </WfLayoutContext.Provider>
    )
}