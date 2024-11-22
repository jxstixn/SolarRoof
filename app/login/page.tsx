"use client"

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import OTPForm from "@/components/auth/OTPForm";
import LoginForm from "@/components/auth/LoginForm";

function Page() {
    const router = useRouter()
    const [username, setUsername] = useState<string>('')
    const [nextStep, setNextStep] = useState<"CONFIRM_SIGN_IN_WITH_TOTP_CODE" | "CONFIRM_SIGN_IN_WITH_CUSTOM_CHALLENGE"
        | "CONTINUE_SIGN_IN_WITH_MFA_SELECTION" | "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED"
        | "CONFIRM_SIGN_IN_WITH_SMS_CODE" | "CONFIRM_SIGN_IN_WITH_EMAIL_CODE" | "CONTINUE_SIGN_IN_WITH_TOTP_SETUP"
        | "CONTINUE_SIGN_IN_WITH_EMAIL_SETUP" | "CONTINUE_SIGN_IN_WITH_MFA_SETUP_SELECTION" | "CONFIRM_SIGN_UP"
        | "RESET_PASSWORD" | "DONE" | "COMPLETE_AUTO_SIGN_IN">()

    useEffect(() => {
        if (nextStep === "COMPLETE_AUTO_SIGN_IN" || nextStep === "DONE") {
            // Redirect to the dashboard
            router.push('/dashboard')
        }
    }, [nextStep, router]);

    return (nextStep === "CONFIRM_SIGN_UP"
            ? <OTPForm username={username} setNextStep={setNextStep}/>
            : <LoginForm setUsername={setUsername} setNextStep={setNextStep}/>
    )
}

export default Page