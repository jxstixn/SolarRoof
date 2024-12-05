"use client"
import SubmitButton from "@/components/auth/SubmitButton";
import Image from "next/image";
import {SharedSelection} from "@nextui-org/react";

interface RoleFormProps {
    loading: boolean,
    setLoading: (loading: boolean) => void,
    role: "Investor" | "Lister",
    setRole: (role: "Investor" | "Lister") => void,
    setStep: (step: "ROLE" | "PREFERENCES" | "DONE") => void,
    submitUser: (preferences?: {
        projectType: string[],
        roofType: string[],
        solarScore: number[]
        price: number[]
        location: SharedSelection
    }) => void
}

function RoleForm({loading, setLoading, role, setRole, setStep, submitUser}: RoleFormProps) {
    async function submitRole() {
        setLoading(true)

        if (!role) {
            setLoading(false)
            return
        }

        // Set the next step
        switch (role) {
            case "Investor":
                setStep("PREFERENCES")
                break
            case "Lister":
                submitUser();
                break
        }
        setLoading(false)
    }

    return (
        <form action={submitRole} noValidate
              className="flex flex-col w-full h-full max-h-full items-center justify-center text-zinc-800 font-bold text-md overflow-hidden p-8 animate-fade-in-up">
            <div className={"flex flex-col bg-white w-full sm:w-96 rounded-3xl p-4 gap-4 shadow-md"}>
                <div className={"flex flex-col"}>
                    <p>{"Let's get you set up!"}</p>
                    <p className={
                        "text-sm text-gray-500"
                    }>{"What are you interested in?"}</p>
                </div>
                <div className={"flex flex-row gap-8 p-4"}>
                    <div className={"flex flex-col w-full bg-white rounded-lg gap-2 cursor-pointer"}
                         onClick={() => setRole("Investor")}>
                        <Image
                            src={"/images/investorLogo.webp"}
                            alt={"Investor"}
                            className={"h-36 w-full object-cover rounded-lg shadow-md transition-all transform "
                                + (role === "Investor" && "border-3 border-primary scale-105")
                            } width={1000} height={1000}/>
                        <p className={"text-center"}>{"Investing"}</p>
                    </div>
                    <div className={"flex flex-col w-full bg-white rounded-lg gap-2 cursor-pointer"}
                         onClick={() => setRole("Lister")}>
                        <Image
                            src={"/images/listerLogo.webp"}
                            alt={"Lister"}
                            className={"h-36 w-full object-cover rounded-lg shadow-md transition-all transform "
                                + (role === "Lister" && "border-3 border-primary scale-105")
                            } width={1000} height={1000}/>
                        <p className={"text-center"}>{"Listing"}</p>
                    </div>
                </div>
                <SubmitButton name={"Submit"} loading={loading}/>
            </div>
        </form>
    )
}

export default RoleForm