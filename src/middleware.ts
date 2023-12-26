export { auth as authMiddleware } from "auth"
import { NextRequest, NextResponse } from "next/server"

import { getFullUrl } from "./lib/router-helper"
import RouterInfo from "./settings/router-setting"


// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

export function middleware(req: NextRequest) {
  const url = req.nextUrl
  // const host = req.headers.get('host')?.toLowerCase()

  const rewrittenUrl = new URL(url.toString())
  /**
   * redirect url from there
   * example: 
   * const host = req.headers.get('host')?.toLowerCase()
   * if (host === '/') {
   *    rewrittenUrl.pathname = `/makereal.tldraw.link${rewrittenUrl.pathname}`
   * } else {
   *    rewrittenUrl.pathname = `/makereal.tldraw.com${rewrittenUrl.pathname}`
   * }
   */

  if (rewrittenUrl.pathname === '/') {
    rewrittenUrl.pathname = getFullUrl(RouterInfo.HOME)
  }

  return NextResponse.rewrite(rewrittenUrl)
}

