
import NextAuth, { NextAuthConfig } from "next-auth"
import Credentials from 'next-auth/providers/credentials';

import RouterInfo from "./router"

import { coverSearchParamsToObj } from "@/api-helpers/url-helper";
import { getFullUrl } from "@/lib/router"

export const authConfig: NextAuthConfig = {
    debug: true,
    pages: {
        signIn: '/login'
    },
    providers: [
        Credentials({
            credentials: { password: { label: "Password", type: "password" } },
            authorize(c) {
                if (c.password !== "1") return null;
                return {
                    name: "Fill Murray",
                    email: "bill@fillmurray.com",
                    image: "https://www.fillmurray.com/64/64",
                    id: "1",
                };
            },
        }),
    ],
    callbacks: {
        authorized(params) {
            const { auth, request: { nextUrl }, } = params
            const { pathname, searchParams } = nextUrl;
            if (pathname === "/login") {
                const { callbackUrl } = coverSearchParamsToObj<any>(searchParams);
                if (!!auth && !!callbackUrl) {
                    return Response.redirect(new URL(callbackUrl, nextUrl));
                }
                return true
            }
            if (pathname === '/') {
                return Response.redirect(new URL(getFullUrl(RouterInfo.HOME), nextUrl));
            }
            return !!auth
        },
    },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
