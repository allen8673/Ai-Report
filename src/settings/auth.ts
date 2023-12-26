
import NextAuth from "next-auth"
import type { NextAuthConfig } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";

export const config = {
    // theme: {
    //     logo: "https://next-auth.js.org/img/logo/logo-sm.png",
    // },
    pages: {
        signIn: '/'
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                console.log('trace credentials', credentials)
                // const authResponse = await fetch("/users/login", {
                //     method: "POST",
                //     headers: {
                //         "Content-Type": "application/json",
                //     },
                //     body: JSON.stringify(credentials),
                // })

                // if (!authResponse.ok) {
                //     return null
                // }
                const user = { id: "1", name: "J Smith", email: "jsmith@example.com" }


                return user
            },
        }),
    ],
    callbacks: {
        // authorized({ request, auth }) {
        //     /** Custom logic */
        //     return true
        // },
    },
    secret: process.env.NEXT_PUBLIC_SECRET
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)