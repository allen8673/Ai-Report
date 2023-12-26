import { authConfig } from 'auth.config';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

interface User {
    id: string;
    name: string;
    email: string;
}

async function getUser(email: string): Promise<User | undefined> {
    return new Promise<User>(function (resolve) {
        setTimeout(function () {
            resolve({ id: "1", name: "J Smith", email: "jsmith@example.com" })
        }, 1000);
    });
}

export const { auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
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
                const user = await getUser('');
                return user || null
            },
        })],
});