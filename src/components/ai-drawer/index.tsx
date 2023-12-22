'use client'
import { useEditor, Tldraw } from "@tldraw/tldraw";
import { Button } from "primereact/button";
import { useCallback } from "react";

import { PreviewShapeUtil } from "./PreviewShape";
import { makeReal } from "./makereal-core";

import '@tldraw/tldraw/tldraw.css'
import { useLayoutContext } from "@/layout/turbo-layout/context";

const shapeUtils = [PreviewShapeUtil]

function ExportButton() {
    const editor = useEditor();
    const { showMessage } = useLayoutContext()

    const onExport = useCallback(async () => {
        try {
            await makeReal(editor)
        } catch (e: any) {
            showMessage({
                type: 'error',
                message: e.message,
            });
        }
    }, [editor])

    return (
        <Button
            onClick={onExport}
            style={{ pointerEvents: 'all' }}
            className="cursor-pointer my-2 mx-2">
            Make Real
        </Button>
    )
}

export default function LayoutDrawer() {
    return (
        <div className={`h-full w-full`}>
            <div className='relative w-full h-full z-1'>
                <Tldraw shapeUtils={shapeUtils} shareZone={<ExportButton />} className={`rounded-std`} />
            </div>
        </div>
    )
}