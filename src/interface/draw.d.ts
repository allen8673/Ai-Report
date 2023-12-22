import { TLBaseShape } from '@tldraw/tldraw'
export interface DrawData {
    id: string;
    html: string;
}

export type MessageContent =
    | string
    | (
        | string
        | {
            type: 'image_url'
            image_url:
            | string
            | {
                url: string
                detail: 'low' | 'high' | 'auto'
            }
        }
        | {
            type: 'text'
            text: string
        }
    )[]

export type GPT4VCompletionRequest = {
    model: 'gpt-4-vision-preview'
    messages: {
        role: 'system' | 'user' | 'assistant' | 'function'
        content: MessageContent
        name?: string | undefined
    }[]
    functions?: any[] | undefined
    function_call?: any | undefined
    stream?: boolean | undefined
    temperature?: number | undefined
    top_p?: number | undefined
    max_tokens?: number | undefined
    n?: number | undefined
    best_of?: number | undefined
    frequency_penalty?: number | undefined
    presence_penalty?: number | undefined
    logit_bias?:
    | {
        [x: string]: number
    }
    | undefined
    stop?: (string[] | string) | undefined
}

export type PreviewShape = TLBaseShape<
    'preview',
    {
        html: string
        source: string
        w: number
        h: number
        linkUploadVersion?: number
        uploadedShapeId?: string
        dateCreated?: number
    }
>
