"use client"

import {Button, Divider, Input} from "@nextui-org/react";
import {FormEvent, useState} from "react";
import {signIn} from "@aws-amplify/auth";

function Page() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [invalidInputs, setInvalidInputs] = useState({
        email: false,
        password: false
    });
    const [error, setError] = useState("");

    const validateEmail = () => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        setInvalidInputs({...invalidInputs, email: !emailRegex.test(formData.email)});
        return emailRegex.test(formData.email);
    }

    const validatePassword = () => {
        setInvalidInputs({...invalidInputs, password: formData.password.length === 0});
        return formData.password.length > 0;
    }

    const validateInputs = () => {
        return validateEmail() && validatePassword();
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        if (!validateInputs()) {
            setLoading(false);
            return;
        }

        try {
            const {nextStep} = await signIn({
                username: formData.email,
                password: formData.password
            });
            console.log(nextStep);
        } catch (e) {
            const error = e as Error;
            setError(error.message);
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} noValidate
              className="flex flex-col w-full h-full max-h-full items-center justify-center text-zinc-800 font-bold text-md overflow-hidden p-8 animate-fade-in-up">
            <div className={"flex flex-col bg-white w-full sm:w-80 rounded-3xl p-4 gap-4 shadow-md"}>
                <div className={"flex flex-col gap-2"}>
                    <h1 className={"text-xl font-bold"}>Login</h1>
                    <Divider/>
                </div>
                <Input
                    id={"email"}
                    label={"Email"}
                    placeholder={"Email"}
                    type={"email"}
                    value={formData.email}
                    onChange={(e) => {
                        setFormData({...formData, email: e.target.value})
                        setInvalidInputs({...invalidInputs, email: false})
                    }}
                    isInvalid={invalidInputs.email}
                    errorMessage={invalidInputs.email ? "Please enter a valid email" : ""}
                    onFocusChange={validateEmail}
                    required/>
                <Input
                    id={"password"}
                    label={"Password"}
                    placeholder={"Password"}
                    type={"password"}
                    value={formData.password}
                    onChange={(e) => {
                        setFormData({...formData, password: e.target.value})
                        setInvalidInputs({...invalidInputs, password: false})
                    }}
                    onFocusChange={validatePassword}
                    isInvalid={invalidInputs.password}
                    errorMessage={invalidInputs.password ? "Please enter a password" : ""}
                    required/>
                <Button
                    isLoading={loading}
                    type={"submit"}
                    color={"primary"}
                    className={"font-bold shadow-md"}>
                    Login
                </Button>
                <p className={error ? "text-center text-sm text-danger" : "hidden"}>
                    {error}
                </p>
                <p className={"text-center text-sm"}>
                    Don&apos;t have an account? <a href={"/register"} className={"text-primary"}>Register</a>
                </p>
            </div>
        </form>
    )
}

export default Page