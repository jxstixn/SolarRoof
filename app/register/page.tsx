"use client"
import RegisterForm from "@/components/auth/RegisterForm";
import {useEffect, useState} from "react";
import OTPForm from "@/components/auth/OTPForm";
import {useRouter} from "next/navigation";
import Loader from "@/components/Loader";

function Page() {
    const router = useRouter()
    const [username, setUsername] = useState<string>('')
    const [nextStep, setNextStep] = useState<"CONFIRM_SIGN_IN_WITH_TOTP_CODE" | "CONFIRM_SIGN_IN_WITH_CUSTOM_CHALLENGE"
        | "CONTINUE_SIGN_IN_WITH_MFA_SELECTION" | "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED"
        | "CONFIRM_SIGN_IN_WITH_SMS_CODE" | "CONFIRM_SIGN_IN_WITH_EMAIL_CODE" | "CONTINUE_SIGN_IN_WITH_TOTP_SETUP"
        | "CONTINUE_SIGN_IN_WITH_EMAIL_SETUP" | "CONTINUE_SIGN_IN_WITH_MFA_SETUP_SELECTION" | "CONFIRM_SIGN_UP"
        | "RESET_PASSWORD" | "DONE" | "COMPLETE_AUTO_SIGN_IN">()

    useEffect(() => {
        if (nextStep === "DONE") {
            router.push('/dashboard')
        }
    }, [nextStep, router]);

    switch (nextStep) {
        case undefined:
            return <RegisterForm setUsername={setUsername} setNextStep={setNextStep}/>
        case "CONFIRM_SIGN_UP":
            return <OTPForm username={username} setNextStep={setNextStep}/>
        default:
            return <Loader className={"shadow-md"}/>
    }
}

export default Page