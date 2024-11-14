"use client"
import {Button, Divider, Input} from "@nextui-org/react";
import {FormEvent, useState} from "react";

function Page() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [invalidInputs, setInvalidInputs] = useState({
        email: false,
        password: false,
        confirmPassword: false
    });

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
    }

    return (
        <form onSubmit={handleSubmit} noValidate
              className="flex flex-col w-full h-full max-h-full items-center justify-center text-zinc-800 font-bold text-md overflow-hidden p-8 animate-fade-in-up">
            <div className={"flex flex-col bg-white w-full sm:w-80 rounded-3xl p-4 gap-4 shadow-md"}>
                <div className={"flex flex-col gap-2"}>
                    <h1 className={"text-xl font-bold"}>Register</h1>
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
                    isInvalid={invalidInputs.password}
                    errorMessage={invalidInputs.password ? "Please enter a password" : ""}
                    required/>
                <Input
                    id={"confirmPassword"}
                    label={"Confirm Password"}
                    placeholder={"Confirm Password"}
                    type={"password"}
                    value={formData.confirmPassword}
                    onChange={(e) => {
                        setFormData({...formData, confirmPassword: e.target.value})
                        setInvalidInputs({...invalidInputs, confirmPassword: false})
                    }}
                    isInvalid={invalidInputs.confirmPassword}
                    errorMessage={invalidInputs.confirmPassword ? "Passwords do not match" : ""}
                    onFocusChange={() => {
                        setInvalidInputs({
                            ...invalidInputs,
                            confirmPassword: formData.confirmPassword !== formData.password
                        })
                    }}
                    required/>
                <Button
                    isLoading={loading}
                    type={"submit"}
                    color={"primary"}
                    className={"font-bold shadow-md"}>
                    Register
                </Button>
                <p className={"text-center text-sm"}>
                    Already have an account? <a href={"/login"} className={"text-primary"}>Login</a>
                </p>
            </div>
        </form>
    )
}

export default Page