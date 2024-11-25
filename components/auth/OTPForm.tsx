import useWebOTP from "@/components/auth/useWebOTP";
import {useState} from "react";
import {Input} from "@nextui-org/react";
import SubmitButton from "@/components/auth/SubmitButton";
import {confirmSignUp} from 'aws-amplify/auth';
import {autoSignIn} from "@aws-amplify/auth";

interface OTPFormProps {
    username: string
    setNextStep: (nextStep: "DONE" | "CONFIRM_SIGN_UP" | "COMPLETE_AUTO_SIGN_IN" | "CONFIRM_SIGN_IN_WITH_TOTP_CODE"
        | "CONFIRM_SIGN_IN_WITH_CUSTOM_CHALLENGE" | "CONTINUE_SIGN_IN_WITH_MFA_SELECTION"
        | "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED" | "CONFIRM_SIGN_IN_WITH_SMS_CODE"
        | "CONFIRM_SIGN_IN_WITH_EMAIL_CODE" | "CONTINUE_SIGN_IN_WITH_TOTP_SETUP"
        | "CONTINUE_SIGN_IN_WITH_EMAIL_SETUP" | "CONTINUE_SIGN_IN_WITH_MFA_SETUP_SELECTION" | "RESET_PASSWORD"
    ) => void
}

function OTPForm({username, setNextStep}: OTPFormProps) {
    const [loading, setLoading] = useState(false)
    const [invalid, setInvalid] = useState(false)
    const [otp, setOtp] = useState<string>('');

    // Callback for when OTP is automatically retrieved
    const handleOtpReceived = (code: string) => {
        setOtp(code);
    };

    // Initialize the WebOTP hook
    useWebOTP(handleOtpReceived);

    async function submitOTP() {
        setLoading(true)

        if (!otp) {
            setInvalid(true)
            setLoading(false)
            return
        }

        try {
            await confirmSignUp({
                username: username,
                confirmationCode: otp,
            })

            const {nextStep} = await autoSignIn()

            setNextStep(nextStep.signInStep)
        } catch (e) {
            console.error(e)
            setInvalid(true)
        }
        setLoading(false)
    }

    return (
        <form action={submitOTP} noValidate
              className="flex flex-col w-full h-full max-h-full items-center justify-center text-zinc-800 font-bold text-md overflow-hidden p-8 animate-fade-in-up">
            <div className={"flex flex-col bg-white w-full sm:w-96 rounded-3xl p-4 gap-4 shadow-md"}>
                <div className={"flex flex-col"}>
                    <p>{"Registration Successful!"}</p>
                    <p className={
                        "text-sm text-gray-500"
                    }>{"Check your Mails for the OTP"}</p>
                </div>
                <Input
                    id={"otp"}
                    name={"otp"}
                    label={"OTP"}
                    placeholder={"Enter OTP"}
                    type={"text"}
                    className={"w-full"}
                    inputMode={"numeric"}
                    autoComplete="one-time-code"
                    pattern="\d{6}"
                    isDisabled={loading}
                    isInvalid={invalid}
                    errorMessage={invalid ?? "Please enter a valid OTP"}
                    onValueChange={(value) => {
                        setOtp(value)
                        setInvalid(false)
                    }}
                    required/>
                <SubmitButton name={"Submit"} loading={loading}/>
            </div>
        </form>
    );
}

export default OTPForm;