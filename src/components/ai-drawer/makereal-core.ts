import { Editor, createShapeId, getSvgAsImage } from "@tldraw/tldraw";

import apiCaller from "../../api-helpers/api-caller";

import { addDraw } from "@/api-helpers/draw-api";
import { OPENAI_USER_PROMPT, OPENAI_USER_PROMPT_WITH_PREVIOUS_DESIGN } from "@/components/ai-drawer/prompt";
import { GPT4VCompletionRequest, MessageContent, PreviewShape } from "@/interface/draw";

const GPT_URL = process.env.NEXT_PUBLIC_GPT_URL;
const GPT_KEY = process.env.NEXT_PUBLIC_GPT_KEY;

interface GetHtmlFromOpenAI {
    image: string
    text: string
    theme?: string
    previousPreviews: PreviewShape[];
    prompt: string;
}

export const makeReal = async (editor: Editor, prompt: string) => {
    const newShapeId = createShapeId();
    const selectedShapes = editor.getSelectedShapes();

    if (selectedShapes.length === 0) throw Error('First select something to make real.');
    if (!prompt) throw Error('Have to give a prompt!');


    const { maxX, midY } = editor.getSelectionPageBounds() || {}

    const previousPreviews = selectedShapes.filter((shape) => {
        return shape.type === 'preview'
    }) as PreviewShape[]

    const svg = await editor.getSvg(selectedShapes, {
        scale: 1,
        background: true,
    })

    if (!svg) throw Error(`Could not get the SVG.`)

    const IS_SAFARI = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

    const blob = await getSvgAsImage(svg, IS_SAFARI, {
        type: 'png',
        quality: 0.8,
        scale: 1,
    })

    const dataUrl = await blobToBase64(blob!)

    //// For testing, let's see the image
    // downloadDataURLAsFile(dataUrl, 'tldraw.png')

    editor.createShape<PreviewShape>({
        id: newShapeId,
        type: 'preview',
        x: (maxX || 0) + 60, // to the right of the selection
        y: (midY || 0) - (540 * 2) / 3 / 2, // half the height of the preview's initial shape
        props: { html: '', source: dataUrl as string },
    })

    const textFromShapes = getSelectionAsText(editor)

    try {
        const json = await getHtmlFromOpenAI({
            image: dataUrl,
            text: textFromShapes,
            previousPreviews,
            theme: editor.user.getUserPreferences().isDarkMode ? 'dark' : 'light',
            prompt
        })

        if (json.error) {
            throw Error(`${json.error.message?.slice(0, 100)}...`)
        }

        const message = json.choices[0].message.content
        const start = message.indexOf('<!DOCTYPE html>')
        const end = message.indexOf('</html>')
        const html = message.slice(start, end + '</html>'.length)

        if (html.length < 100) {
            throw Error('Could not generate a design from those wireframes.')
        }

        await addDraw(newShapeId, html)

        editor.updateShape<PreviewShape>({
            id: newShapeId,
            type: 'preview',
            props: {
                html,
                source: dataUrl as string,
                linkUploadVersion: 1,
                uploadedShapeId: newShapeId,
            },
        })
    } catch (e) {
        editor.deleteShape(newShapeId)
        throw e
    }
}

export const getHtmlFromOpenAI = async ({ image,
    text,
    theme = 'light',
    previousPreviews,
    prompt
}: GetHtmlFromOpenAI) => {

    if (!GPT_URL) throw Error('Have to assign an working GPT-4 URL')

    const messages: GPT4VCompletionRequest['messages'] = [
        {
            role: 'system',
            content: prompt,
        },
        {
            role: 'user',
            content: [],
        },
    ];

    const userContent = messages[1].content as Exclude<MessageContent, string>;
    // Add the image
    userContent.push(
        {
            type: 'text',
            text:
                (previousPreviews.length || 0) > 0 ? OPENAI_USER_PROMPT_WITH_PREVIOUS_DESIGN : OPENAI_USER_PROMPT,
        },
        {
            type: 'image_url',
            image_url: {
                url: image,
                detail: 'high',
            },
        }
    );

    // Add the strings of text
    if (text) {
        userContent.push({
            type: 'text',
            text: `Here's a list of text that we found in the design:\n${text}`,
        })
    } else {
        userContent.push({
            type: 'text',
            text: `There wasn't any text in this design. You'll have to work from just the images.`,
        })
    }

    // Add the previous previews as HTML
    for (let i = 0; i < previousPreviews.length; i++) {
        const preview = previousPreviews[i]
        userContent.push(
            {
                type: 'text',
                text: `The designs also included one of your previous result. Here's the image that you used as its source:`,
            },
            {
                type: 'image_url',
                image_url: {
                    url: preview.props.source,
                    detail: 'high',
                },
            },
            {
                type: 'text',
                text: `And here's the HTML you came up with for it: ${preview.props.html}`,
            }
        )
    }

    // Prompt the theme
    userContent.push({
        type: 'text',
        text: `Please make your result use the ${theme} theme.`,
    })

    const body: GPT4VCompletionRequest = {
        model: 'gpt-4-vision-preview',
        max_tokens: 4096,
        temperature: 0,
        messages,
    }

    const json = (await apiCaller.post(GPT_URL, body, {
        headers: {
            'Content-Type': 'application/json',
            'api-key': GPT_KEY
        }
    })).data

    return json
}

export function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result as string)
        reader.readAsDataURL(blob)
    })
}


function getSelectionAsText(editor: Editor) {
    const selectedShapeIds = editor.getSelectedShapeIds()
    const selectedShapeDescendantIds = editor.getShapeAndDescendantIds(selectedShapeIds)

    const texts = Array.from(selectedShapeDescendantIds)
        .map((id) => {
            const shape = editor.getShape(id)!
            return shape
        })
        .filter((shape) => {
            return (
                shape.type === 'text' ||
                shape.type === 'geo' ||
                shape.type === 'arrow' ||
                shape.type === 'note'
            )
        })
        .sort((a, b) => {
            // top first, then left, based on page position
            const pageBoundsA = editor.getShapePageBounds(a)
            const pageBoundsB = editor.getShapePageBounds(b)

            if (!pageBoundsA || !pageBoundsB) return -1

            return pageBoundsA.y === pageBoundsB.y
                ? pageBoundsA.x < pageBoundsB.x
                    ? -1
                    : 1
                : pageBoundsA.y < pageBoundsB.y
                    ? -1
                    : 1
        })
        .map((shape) => {
            if (!shape) return null
            return (shape.props as any).text ?? null
        })
        .filter((v) => !!v)

    return texts.join('\n')
}