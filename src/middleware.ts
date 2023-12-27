import { auth } from "./settings/auth";

export const config = {
  //   matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
  matcher: ["/", "/login", "/ai-report/home"]
};

export const middleware = auth;


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
//   return NextResponse.rewrite(rewrittenUrl)
// })


