"use client"
import {Divider, Input} from "@nextui-org/react";
import {useState} from "react";
import SubmitButton from "@/components/auth/SubmitButton";
import {validateUser} from "@/actions/zod/register";
import {signUp} from "@aws-amplify/auth";

interface RegisterFormProps {
    setUsername: (username: string) => void
    setNextStep: (nextStep: "DONE" | "CONFIRM_SIGN_UP" | "COMPLETE_AUTO_SIGN_IN") => void
}

function RegisterForm({setUsername, setNextStep}: RegisterFormProps) {
    const [loading, setLoading] = useState(false)

    const [invalidInputs, setInvalidInputs] = useState<{
        givenName? : string[] | undefined;
        familyName? : string[] | undefined;
        email? : string[] | undefined;
        password? : string[] | undefined;
        confirmPassword? : string[] | undefined;
    }>({})

    async function registerUser(formData: FormData) {
        setLoading(true)
        const validation = await validateUser(formData)

        if (!validation.success) {
            setInvalidInputs(validation.errors)
            setLoading(false)
            return
        }

        const signUpData = {
            username: formData.get('email') as string,
            password: formData.get('password') as string,
            options: {
                userAttributes: {
                    given_name: formData.get('givenName') as string,
                    family_name: formData.get('familyName') as string,
                },
                autoSignIn: true
            }
        }

        try {
            const {nextStep} = await signUp(signUpData)
            setUsername(signUpData.username)
            setNextStep(nextStep.signUpStep)

        } catch (e) {
            if (e instanceof Error && e.toString().includes("UsernameExistsException")) {
                setInvalidInputs({
                    email: ['An account with this email already exists']
                })
                setLoading(false)
                return
            }
            alert(e)
            setLoading(false)
        }
    }

    return (
        <form action={registerUser} noValidate
              className="flex flex-col w-full h-full max-h-full items-center justify-center text-zinc-800 font-bold text-md overflow-hidden p-8 animate-fade-in-up">
            <div className={"flex flex-col bg-white w-full sm:w-96 rounded-3xl p-4 gap-4 shadow-md"}>
                <div className={"flex flex-col gap-2"}>
                    <h1 className={"text-xl font-bold"}>Register</h1>
                    <Divider/>
                </div>
                <div className={"flex flex-row w-full gap-4"}>
                    <Input
                        id={"givenName"}
                        name={"givenName"}
                        autoComplete={"given-name"}
                        label={"First Name"}
                        placeholder={"First Name"}
                        type={"text"}
                        className={"w-full"}
                        isDisabled={loading}
                        isInvalid={!!invalidInputs.givenName}
                        errorMessage={(invalidInputs.givenName && invalidInputs.givenName[0]) ?? "Please enter a first name"}
                        onValueChange={() => {
                            setInvalidInputs({...invalidInputs, givenName: undefined})
                        }}
                        required/>
                    <Input
                        id={"familyName"}
                        name={"familyName"}
                        autoComplete={"family-name"}
                        label={"Last Name"}
                        placeholder={"Last Name"}
                        type={"text"}
                        className={"w-full"}
                        isDisabled={loading}
                        isInvalid={!!invalidInputs.familyName}
                        errorMessage={(invalidInputs.familyName && invalidInputs.familyName[0]) ?? "Please enter a last name"}
                        onValueChange={() => {
                            setInvalidInputs({...invalidInputs, familyName: undefined})
                        }}
                        required/>
                </div>
                <Input
                    id={"email"}
                    name={"email"}
                    autoComplete={"email"}
                    label={"Email"}
                    placeholder={"Email"}
                    type={"email"}
                    className={"w-full"}
                    isDisabled={loading}
                    isInvalid={!!invalidInputs.email}
                    errorMessage={(invalidInputs.email && invalidInputs.email[0]) ?? "Please enter a valid email"}
                    onValueChange={() => {
                        setInvalidInputs({...invalidInputs, email: undefined})
                    }}
                    required/>
                <Input
                    id={"password"}
                    name={"password"}
                    autoComplete={"new-password"}
                    label={"Password"}
                    placeholder={"Password"}
                    type={"password"}
                    className={"w-full"}
                    isDisabled={loading}
                    isInvalid={!!invalidInputs.password}
                    errorMessage={(invalidInputs.password && invalidInputs.password[0]) ?? "Please enter a password"}
                    onValueChange={() => {
                        setInvalidInputs({...invalidInputs, password: undefined})
                    }}
                    required/>
                <Input
                    id={"confirmPassword"}
                    name={"confirmPassword"}
                    autoComplete={"new-password"}
                    label={"Confirm Password"}
                    placeholder={"Confirm Password"}
                    type={"password"}
                    className={"w-full"}
                    isDisabled={loading}
                    isInvalid={!!invalidInputs.confirmPassword}
                    errorMessage={(invalidInputs.confirmPassword && invalidInputs.confirmPassword[0]) ?? "Please confirm your password"}
                    onValueChange={() => {
                        setInvalidInputs({...invalidInputs, confirmPassword: undefined})
                    }}
                    required/>
                <SubmitButton name={"Register"} loading={loading}/>
                <p className={"text-center text-sm"}>
                    Already have an account? <a href={"/login"} className={"text-primary"}>Login</a>
                </p>
            </div>
        </form>
    )
}

export default RegisterForm