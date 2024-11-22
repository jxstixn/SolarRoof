"use client"
import {useState} from "react";
import {signIn} from "@aws-amplify/auth";
import {Divider, Input} from "@nextui-org/react";
import SubmitButton from "@/components/auth/SubmitButton";

interface LoginFormProps {
    setUsername: (username: string) => void
    setNextStep: (nextStep: "CONFIRM_SIGN_IN_WITH_TOTP_CODE" | "CONFIRM_SIGN_IN_WITH_CUSTOM_CHALLENGE"
        | "CONTINUE_SIGN_IN_WITH_MFA_SELECTION" | "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED"
        | "CONFIRM_SIGN_IN_WITH_SMS_CODE" | "CONFIRM_SIGN_IN_WITH_EMAIL_CODE" | "CONTINUE_SIGN_IN_WITH_TOTP_SETUP"
        | "CONTINUE_SIGN_IN_WITH_EMAIL_SETUP" | "CONTINUE_SIGN_IN_WITH_MFA_SETUP_SELECTION" | "CONFIRM_SIGN_UP"
        | "RESET_PASSWORD" | "DONE") => void
}

function LoginForm({setUsername, setNextStep}: LoginFormProps) {
    const [error, setError] = useState("");
    const [invalidInputs, setInvalidInputs] = useState<{
        email? : string | undefined;
        password? : string | undefined;
    }>({})

    function validateInputs(formData: FormData) {
        const newInvalidInputs = {...invalidInputs};
        if (!formData.get("email")) {
            newInvalidInputs.email = "Please enter an email";
        }
        if (!formData.get("password")) {
            newInvalidInputs.password = "Please enter a password";
        }
        setInvalidInputs(newInvalidInputs);
        return Object.values(newInvalidInputs).every((value) => !value);
    }

    async function loginUser(formData: FormData) {
        if (!validateInputs(formData)) {
            return;
        }
        try {
            const {nextStep} = await signIn({
                username: formData.get("email") as string,
                password: formData.get("password") as string,
            });
            setUsername(formData.get("email") as string);
            setNextStep(nextStep.signInStep)
        } catch (e) {
            const error = e as Error;
            setError(error.message);
        }
    }

    return (
        <form action={loginUser} noValidate
              className="flex flex-col w-full h-full max-h-full items-center justify-center text-zinc-800 font-bold text-md overflow-hidden p-8 animate-fade-in-up">
            <div className={"flex flex-col bg-white w-full sm:w-80 rounded-3xl p-4 gap-4 shadow-md"}>
                <div className={"flex flex-col gap-2"}>
                    <h1 className={"text-xl font-bold"}>Login</h1>
                    <Divider/>
                </div>
                <Input
                    id={"email"}
                    name={"email"}
                    label={"Email"}
                    placeholder={"Email"}
                    type={"email"}
                    onChange={() => {
                        setInvalidInputs({...invalidInputs, email: undefined});
                        setError("");
                    }}
                    isInvalid={!!error || !!invalidInputs.email}
                    errorMessage={invalidInputs.email ? "Please enter a valid email" : ""}
                    required/>
                <Input
                    id={"password"}
                    name={"password"}
                    label={"Password"}
                    placeholder={"Password"}
                    type={"password"}
                    onChange={() => {
                        setInvalidInputs({...invalidInputs, password: undefined});
                        setError("");
                    }}
                    isInvalid={!!error || !!invalidInputs.password}
                    errorMessage={invalidInputs.password ? "Please enter a password" : ""}
                    required/>
                <SubmitButton
                    name={"Login"}
                >
                </SubmitButton>
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

export default LoginForm