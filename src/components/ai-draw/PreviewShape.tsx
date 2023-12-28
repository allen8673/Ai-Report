/* eslint-disable react-hooks/rules-of-hooks */
// import { faCode } from '@fortawesome/free-solid-svg-icons'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import {
	BaseBoxShapeUtil,
	DefaultSpinner,
	HTMLContainer,
	TLBaseShape,
	Vec2d,
	toDomPrecision,
	useIsEditing,
	useValue,
} from '@tldraw/tldraw'
import { useEffect } from 'react'

import { addDraw } from '@/api-helpers/draw-api'
import { getFullUrl } from '@/lib/router'
import RouterInfo from '@/settings/router'



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

export class PreviewShapeUtil extends BaseBoxShapeUtil<PreviewShape> {
	static override type = 'preview' as const

	getDefaultProps(): PreviewShape['props'] {
		return {
			html: '',
			source: '',
			w: (960 * 2) / 3,
			h: (540 * 2) / 3,
			dateCreated: Date.now(),
		}
	}

	override canEdit = () => true
	override isAspectRatioLocked = () => false
	override canResize = () => true
	override canBind = () => false
	override canUnmount = () => false

	override component(shape: PreviewShape) {
		const isEditing = useIsEditing(shape.id)
		const boxShadow = useValue(
			'box shadow',
			() => {
				const rotation = this.editor.getShapePageTransform(shape)!.rotation()
				return getRotatedBoxShadow(rotation)
			},
			[this.editor]
		)

		const { html, linkUploadVersion, uploadedShapeId } = shape.props

		// upload the html if we haven't already:
		useEffect(() => {
			let isCancelled = false
			if (html && (linkUploadVersion === undefined || uploadedShapeId !== shape.id)) {
				; (async () => {

					await addDraw(shape.id, html)
					if (isCancelled) return

					this.editor.updateShape<PreviewShape>({
						id: shape.id,
						type: 'preview',
						props: {
							linkUploadVersion: 1,
							uploadedShapeId: shape.id,
						},
					})
				})()
			}
			return () => {
				isCancelled = true
			}
		}, [shape.id, html, linkUploadVersion, uploadedShapeId])

		const isLoading = linkUploadVersion === undefined || uploadedShapeId !== shape.id
		const preview_draw_url = getFullUrl(RouterInfo.PREVIEW);
		const uploadUrl = [preview_draw_url, '/', shape.id.replace(/^shape:/, '')].join('')

		// const copyHtml = useCallback(() => {
		// 	setHtml(html)
		// }, [html])

		return (
			<HTMLContainer className="tl-embed-container" id={shape.id} onClick={() => alert('99')}>
				{isLoading ? (
					<div
						style={{
							width: '100%',
							height: '100%',
							backgroundColor: 'var(--color-culled)',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							boxShadow,
							border: '1px solid var(--color-panel-contrast)',
							borderRadius: 'var(--radius-2)',
						}}
					>
						<DefaultSpinner />
					</div>
				) : (
					<>
						<iframe
							title='iframe'
							id={`iframe-1-${shape.id}`}
							src={`${uploadUrl}?preview=1&v=${linkUploadVersion}`}
							width={toDomPrecision(shape.props.w)}
							height={toDomPrecision(shape.props.h)}
							draggable={false}
							style={{
								pointerEvents: isEditing ? 'auto' : 'none',
								boxShadow,
								border: '1px solid var(--color-panel-contrast)',
								borderRadius: 'var(--radius-2)',
							}}
						/>
						{/* <div
							className={`
							!absolute !top-[15px] !right-[-35px]
							!w-[40px] !h-[60px]
							!bg-red
							!flex !flex-col !items-center !justify-center gap-2`}
							style={{
								pointerEvents: 'all',
							}}
						>
							<FontAwesomeIcon
								className={`
								p-[7px] rounded-std-sm
								flex-center bg-deep-weak 
								text-[12px] text-light`}
								style={{
									pointerEvents: 'all',
								}}
								icon={faCode}
								onMouseEnter={copyHtml} />
						</div> */}
						<div
							style={{
								textAlign: 'center',
								position: 'absolute',
								bottom: isEditing ? -40 : 0,
								padding: 4,
								fontFamily: 'inherit',
								fontSize: 12,
								left: 0,
								width: '100%',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								pointerEvents: 'none',
							}}
						>
							<span
								style={{
									background: 'var(--color-panel)',
									padding: '4px 12px',
									borderRadius: 99,
									border: '1px solid var(--color-muted-1)',
								}}
							>
								{isEditing ? 'Click the canvas to exit' : 'Double click to interact'}
							</span>
						</div>
					</>
				)}
			</HTMLContainer>
		)
	}

	override toSvg(shape: PreviewShape): SVGElement | Promise<SVGElement> {
		const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
		// while screenshot is the same as the old one, keep waiting for a new one
		return new Promise((resolve) => {
			if (window === undefined) return resolve(g)
			const windowListener = (event: MessageEvent) => {
				if (event.data.screenshot && event.data?.shapeid === shape.id) {
					const image = document.createElementNS('http://www.w3.org/2000/svg', 'image')
					image.setAttributeNS('http://www.w3.org/1999/xlink', 'href', event.data.screenshot)
					image.setAttribute('width', shape.props.w.toString())
					image.setAttribute('height', shape.props.h.toString())
					g.appendChild(image)
					window.removeEventListener('message', windowListener)
					clearTimeout(timeOut)
					resolve(g)
				}
			}
			const timeOut = setTimeout(() => {
				resolve(g)
				window.removeEventListener('message', windowListener)
			}, 2000)
			window.addEventListener('message', windowListener)
			//request new screenshot
			const firstLevelIframe = document.getElementById(`iframe-1-${shape.id}`) as HTMLIFrameElement
			if (!!firstLevelIframe && !!firstLevelIframe.contentWindow) {
				firstLevelIframe.contentWindow.postMessage(
					{ action: 'take-screenshot', shapeid: shape.id },
					'*'
				)
			} else {
				// 
			}
		})
	}

	indicator(shape: PreviewShape) {
		return <rect width={shape.props.w} height={shape.props.h} />
	}
}

// todo: export these from tldraw
const ROTATING_BOX_SHADOWS = [
	{
		offsetX: 0,
		offsetY: 2,
		blur: 4,
		spread: -1,
		color: '#0000003a',
	},
	{
		offsetX: 0,
		offsetY: 3,
		blur: 12,
		spread: -2,
		color: '#0000001f',
	},
]

function getRotatedBoxShadow(rotation: number) {
	const cssStrings = ROTATING_BOX_SHADOWS.map((shadow) => {
		const { offsetX, offsetY, blur, spread, color } = shadow
		const vec = new Vec2d(offsetX, offsetY)
		const { x, y } = vec.rot(-rotation)
		return `${x}px ${y}px ${blur}px ${spread}px ${color}`
	})
	return cssStrings.join(', ')
}