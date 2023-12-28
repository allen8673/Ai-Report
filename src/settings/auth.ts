
import NextAuth, { NextAuthConfig } from "next-auth"
import Credentials from 'next-auth/providers/credentials';

import RouterInfo from "./router"

import { coverSearchParamsToObj } from "@/api-helpers/url-helper";
import { getFullUrl } from "@/lib/router"

export const authConfig: NextAuthConfig = {
    debug: true,
    pages: {
        // signIn: '/login'
    },
    providers: [
        Credentials({
            credentials: {
                id: { label: "User name" },
                password: { label: "Password", type: "password" }
            },
            authorize(c) {
                if (!c.password || !c.id) return null;

                // TODO: Call the customize auth API
                const jwt: string = 'customize-jwt';

                return {
                    name: "Fill Murray",
                    email: "bill@fillmurray.com",
                    image: "https://www.fillmurray.com/64/64",
                    id: "1",
                    jwt
                } as any;
            },
        }),
    ],
    callbacks: {
        /**
         * Note: the token and user data will be passed to jwt at 1st step after authorize
         */
        jwt: async ({ token, user }: any) => {
            // user is only available the first time a user signs in authorized
            const { jwt } = user || token
            return { ...token, jwt };
        },
        /**
         * Note: then, the token and session data will be passed to session after jwt
         */
        session: async ({ token, session }: any) => {
            const { jwt } = token || session
            return { ...session, jwt };
        },
        /**
        * Note: at last step, data will be passed to authorized after all step
        */
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
            return !!(auth as any)?.jwt
        },

    },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
