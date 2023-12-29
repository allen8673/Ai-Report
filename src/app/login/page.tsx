'use client'
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useState } from "react";

import Form from "@/components/form";
import { FormInstance } from "@/components/form/form";
import MatrixAnimationPanel from "@/components/panes/matrix-animation";
import { authenticate } from "@/lib/actions";

export default function LoginForm() {
    const [form, setForm] = useState<FormInstance<{ id: string, password: string }>>()

    return (
        <div className="h-screen flex flex-col  items-center justify-center">
            <MatrixAnimationPanel
                className="position: absolute"
                text="NATIONAL INSTITUTE FOR CYBER SECURITY "
                randomPermutaion={false} fontColor="#95679e" />
            <div className={`
                    w-[400px] h-[400px] p-6 bg-deep-weak/[.8] z-2
                    flex-center flex-col gap-[15px] 
                    rounded-std border-light-weak border-solid border-[3px]
            `}>
                <h1 className={`m-0 text-5xl text-turbo-deep-strong text-shadow-center shadow-turbo-deep `}>
                    AI Report
                </h1>
                <Form
                    defaultValues={{ id: '', password: '' }}
                    onLoad={form => setForm(form)}
                    onDestroyed={() => setForm(undefined)}>{
                        ({ Item }) =>
                            <>
                                <Item name='id' label="ID" rules={
                                    {
                                        required: 'ID is required!',
                                    }
                                }>
                                    <InputText />
                                </Item>
                                <Item name='password' label="Password" rules={
                                    {
                                        required: 'Password is required!',
                                    }
                                } >
                                    <InputText />
                                </Item>
                            </>
                    }
                </Form>
                <Button className="" onClick={async () => {
                    try {
                        const data = await form?.submit();
                        if (!data) throw Error('no data')
                        authenticate(data)
                    } catch {

                    }
                }}
                >
                    Log in
                </Button>
            </div>
        </div>
    )
}
