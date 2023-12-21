'use client'
import { useEditor, useToasts } from "@tldraw/tldraw";
import { Button } from "primereact/button";
import { useCallback } from "react";

import Drawer from "../drawer";

import { PreviewShapeUtil } from "./PreviewShape";
import { makeReal } from "./makereal-core";

export function ExportButton() {
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

const shapeUtils = [PreviewShapeUtil]

export default function LayoutDrawer() {

    return <Drawer shapeUtils={shapeUtils} shareZone={<ExportButton />} />

}