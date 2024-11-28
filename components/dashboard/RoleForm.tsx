"use client"
import SubmitButton from "@/components/auth/SubmitButton";
import Image from "next/image";

interface RoleFormProps {
    loading: boolean,
    setLoading: (loading: boolean) => void,
    role: "Investor" | "Lister",
    setRole: (role: "Investor" | "Lister") => void,
    setStep: (step: "ROLE" | "PREFERENCES" | "DONE") => void
}

function RoleForm({loading, setLoading, role, setRole, setStep}: RoleFormProps) {
    async function submitRole() {
        setLoading(true)

        if (!role) {
            setLoading(false)
            return
        }

        // Set the next step
        setStep("PREFERENCES")
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
                {/*<Select*/}
                {/*    id={"role"}*/}
                {/*    name={"role"}*/}
                {/*    label={"Role"}*/}
                {/*    placeholder={"Select Role"}*/}
                {/*    className={"w-full"}*/}
                {/*    selectionMode={"single"}*/}
                {/*    selectedKeys={role}*/}
                {/*    onChange={() => setInvalid(false)}*/}
                {/*    onSelectionChange={setRole}*/}
                {/*    disallowEmptySelection*/}
                {/*    isInvalid={invalid}*/}
                {/*    errorMessage={invalid && "Please select a role to continue"}*/}
                {/*    description={*/}
                {/*        role.currentKey?.includes("Investor")*/}
                {/*            ? "The investor role allows you to visit our marketplace, get personal recommendations, and invest in solar projects."*/}
                {/*            : role.currentKey?.includes("Lister")*/}
                {/*                ? "The lister role allows you to list your solar projects on our marketplace and get them funded by investors."*/}
                {/*                : "Select a role to continue"*/}
                {/*}*/}
                {/*>*/}
                {/*    <SelectItem key={"Investor"} value={"investor"}>Investor</SelectItem>*/}
                {/*    <SelectItem key={"Lister"} value={"lister"}>Lister</SelectItem>*/}
                {/*</Select>*/}
                <SubmitButton name={"Submit"} loading={loading}/>
            </div>
        </form>
    )
}

export default RoleForm