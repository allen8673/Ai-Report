'use server'
import { signIn, signOut } from "@settings/auth";
import { AuthError } from "next-auth";

export async function authenticate<T extends Record<string, string>>(
    data: T,
) {
    try {
        await signIn('credentials', data);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}

export async function userSignOut() {
    try {
        await signOut()
    } catch (error) {
        throw error;
    }
}