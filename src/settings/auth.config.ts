
import { NextAuthConfig } from "next-auth"

import RouterInfo from "./router"

import { getFullUrl } from "@/lib/router-helper"

export const authConfig: NextAuthConfig = {
    // theme: {
    //     logo: "https://next-auth.js.org/img/logo/logo-sm.png",
    // },
    pages: {
        signIn: '/login'
    },
    providers: [],
    callbacks: {
        async jwt({ token, account, }) {
            console.log("jwt:")
            console.log(token)
            // prints:
            // jwt:
            // {
            //   name: 'Petru Trimbitas',
            //   iat: 1649090585,
            //   exp: 1651682585,
            //   jti: 'b9427004-b5f7-4743-b85c-9d0ab4a73198'
            // }
            return token
        },
        async authorized(prop) {
            const { auth, request: { nextUrl }, } = prop
            console.log('trace auth', auth)
            const { pathname } = nextUrl;
            if (pathname === "/login") { return true }
            if (pathname === '/') {
                return Response.redirect(new URL(getFullUrl(RouterInfo.HOME), nextUrl));
            }
            return !!auth
        },

        async signIn({ profile }) {
            // Only allow sign in for users with email addresses ending with "yourdomain.com"
            console.log("signIn:")
            console.log(profile)

            return true
        },

        async session({ session }) {
            console.log("session:")
            console.log(session)
            return session
        },



    },
} satisfies NextAuthConfig