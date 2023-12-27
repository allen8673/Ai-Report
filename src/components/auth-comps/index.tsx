import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "primereact/button";
import { useFormState, useFormStatus, } from "react-dom";

import { authenticate, userSignOut } from "@/lib/actions";

export async function SignOutButton() {
    const [, dispatch] = useFormState(userSignOut, undefined);

    return (
        <form
            action={dispatch}
        >
            <Button icon={<FontAwesomeIcon className='text-[30px]' icon={faUser} color={'white'} />} className=" p-0" />
        </form>
    );
}

export function SignInForm() {
    const [, dispatch] = useFormState(authenticate, undefined);
    const { pending } = useFormStatus();
    return (
        <form action={dispatch} className="space-y-3">
            <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
                <h1 className={` mb-3 text-2xl`}>
                    Please log in to continue.
                </h1>
                <div className="w-full">
                    <div>
                        <label
                            className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                            htmlFor="email"
                        >
                            Email
                        </label>
                        <div className="relative">
                            <input
                                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                                id="email"
                                name="email"
                                placeholder="Enter your email address"
                                required
                            />

                        </div>
                    </div>
                    <div className="mt-4">
                        <label
                            className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                            htmlFor="password"
                        >
                            Password
                        </label>
                        <div className="relative">
                            <input
                                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                                id="password"
                                type="password"
                                name="password"
                                placeholder="Enter password"
                                required
                            />
                            {/* <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" /> */}
                        </div>
                    </div>
                </div>
                <Button className="mt-4 w-full" aria-disabled={pending}>
                    Log in
                </Button>
            </div>
        </form>
    );
}