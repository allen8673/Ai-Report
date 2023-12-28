import { auth } from "./settings/auth";

export const config = {
  //   matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
  matcher: ["/", "/login", "/ai-report/:path*"]
};

export const middleware = auth;