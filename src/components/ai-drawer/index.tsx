'use client'
import { useEditor, useToasts, Tldraw } from "@tldraw/tldraw";
import { Button } from "primereact/button";
import { useCallback } from "react";

import { PreviewShapeUtil } from "./PreviewShape";
import { makeReal } from "./makereal-core";
import '@tldraw/tldraw/tldraw.css'

const shapeUtils = [PreviewShapeUtil]

function ExportButton() {
    const editor = useEditor();
    const toast = useToasts();

    const onExport = useCallback(async () => {
        try {
            await makeReal(editor)
        } catch (e: any) {
            toast.addToast({
                title: 'Something went wrong',
                description: `${e.message.slice(0, 200)}`,
                actions: [
                    {
                        type: 'primary',
                        label: 'Read the guide',
                        onClick: () => {
                            // open a new tab with the url...
                            window.open(
                                'https://tldraw.notion.site/Make-Real-FAQs-93be8b5273d14f7386e14eb142575e6e',
                                '_blank'
                            )
                        },
                    },
                ],
            })
        }
    }, [editor, toast])

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