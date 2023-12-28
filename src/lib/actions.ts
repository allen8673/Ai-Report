'use server'
import { AuthError } from "next-auth";

import { signIn, signOut } from "@/settings/auth";
export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', formData);
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