'use client'
import { Tldraw, Editor } from "@tldraw/tldraw";
import { Button } from "primereact/button";
import { Splitter, SplitterPanel } from "primereact/splitter";
import { useCallback, useState } from "react";

import Chatbox from "../chatbox";
import ErrorBoundary from "../error-boundary";

import { PreviewShapeUtil } from "./PreviewShape";
import { makeReal } from "./makereal-core";
import { OPEN_AI_SYSTEM_PROMPT } from "./prompt";

import { useLayoutContext } from "@/layout/turbo-layout/context";

import '@tldraw/tldraw/tldraw.css';

export interface AiDrawerProps {
    className?: string;
}
const shapeUtils = [PreviewShapeUtil];
export default function AiDrawer({ className }: AiDrawerProps) {
    const { showMessage } = useLayoutContext();
    const [editor, setEditor] = useState<Editor>()

    const onExport = useCallback(async (prompt: string) => {
        try {
            if (!editor) throw Error('No Editor!')
            await makeReal(editor, prompt)
        } catch (e: any) {
            showMessage({
                type: 'error',
                message: e.message,
            });
        }
    }, [editor])

    return (
        <Splitter className={`h-full ${className || ''}`} layout="vertical">
            <SplitterPanel className="px-[7px] " size={70}>
                <ErrorBoundary>
                    <Tldraw
                        className={`rounded-std`}
                        onMount={e => setEditor(e)}
                        shapeUtils={shapeUtils}
                    />
                </ErrorBoundary>
            </SplitterPanel>
            <SplitterPanel className="overflow-auto px-[7px]" size={30}>
                <Chatbox
                    initialValue={OPEN_AI_SYSTEM_PROMPT}
                    buttonLabel="Make Real"
                    onSend={(content) => {
                        onExport(content || '')
                    }}
                    extention={
                        ({ setContent }) =>
                            <Button
                                severity='info'
                                onClick={() => setContent(OPEN_AI_SYSTEM_PROMPT)}>Apply Default Prompt
                            </Button>
                    }
                />
            </SplitterPanel>
        </Splitter>
    )
}