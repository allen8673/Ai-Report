import { notFound } from "next/navigation"

import { getDraw } from "@/api-helpers/draw-api"
import LinkComponent from "@/components/link-component"


export default async function Page({ params, searchParams }: { params: { id: string }, searchParams: { preview?: string } }) {
    const { id } = params
    const isPreview = !!searchParams.preview
    const rep = await getDraw(id)

    if (!rep?.data) notFound()

    let html: string = rep.data.html

    const SCRIPT_TO_INJECT_FOR_PREVIEW = `
    // send the screenshot to the parent window
  window.addEventListener('message', function(event) {
    if (event.data.action === 'take-screenshot' && event.data.shapeid === "shape:${id}") {
      html2canvas(document.body, {useCors : true, foreignObjectRendering: true, allowTaint: true }).then(function(canvas) {
        const data = canvas.toDataURL('image/png');
        window.parent.parent.postMessage({screenshot: data, shapeid: "shape:${id}"}, "*");
      });
    }
  }, false);
  // and prevent the user from pinch-zooming into the iframe
    document.body.addEventListener('wheel', e => {
        if (!e.ctrlKey) return;
        e.preventDefault();
    }, { passive: false })
`

    if (isPreview) {
        html = html.includes('</body>')
            ? html.replace(
                '</body>',
                `<script src="https://unpkg.com/html2canvas"></script><script>${SCRIPT_TO_INJECT_FOR_PREVIEW}</script></body>`
            )
            : html + `<script>${SCRIPT_TO_INJECT_FOR_PREVIEW}</script>`
    }

    return <LinkComponent linkId={id} isPreview={isPreview} html={html} />
}