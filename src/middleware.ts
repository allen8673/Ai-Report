import { authConfig } from "auth.config"
import NextAuth from "next-auth"


export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

export default NextAuth(authConfig).auth;

// export const middleware = auth((req: NextRequest) => {
//   const url = req.nextUrl
//   const rewrittenUrl = new URL(url.toString())
//   /**
//    * redirect url from there
//    * example: 
//    * const host = req.headers.get('host')?.toLowerCase()
//    * if (host === '/') {
//    *    rewrittenUrl.pathname = `/makereal.tldraw.link${rewrittenUrl.pathname}`
//    * } else {
//    *    rewrittenUrl.pathname = `/makereal.tldraw.com${rewrittenUrl.pathname}`
//    * }
//    */

//   console.log('trace middle')

//   if (rewrittenUrl.pathname === '/') {
//     rewrittenUrl.pathname = getFullUrl(RouterInfo.HOME)
//   }

//   return NextResponse.rewrite(rewrittenUrl)
// })


