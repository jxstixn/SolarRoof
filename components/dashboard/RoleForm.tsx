"use client"
import {useState} from "react";
import {Select, SelectItem, SharedSelection} from "@nextui-org/react";
import SubmitButton from "@/components/auth/SubmitButton";

interface RoleFormProps {
    loading: boolean,
    setLoading: (loading: boolean) => void,
    role: SharedSelection,
    setRole: (role: SharedSelection) => void,
    setStep: (step: "ROLE" | "PREFERENCES" | "DONE") => void
}

function RoleForm({loading, setLoading, role, setRole, setStep}: RoleFormProps) {
    const [invalid, setInvalid] = useState<boolean>(false)

    async function submitRole() {
        setLoading(true)

        if (!role.currentKey) {
            setLoading(false)
            setInvalid(true)
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
                <Select
                    id={"role"}
                    name={"role"}
                    label={"Role"}
                    placeholder={"Select Role"}
                    className={"w-full"}
                    selectionMode={"single"}
                    selectedKeys={role}
                    onChange={() => setInvalid(false)}
                    onSelectionChange={setRole}
                    disallowEmptySelection
                    isInvalid={invalid}
                    errorMessage={invalid && "Please select a role to continue"}
                    description={
                        role.currentKey?.includes("Investor")
                            ? "The investor role allows you to visit our marketplace, get personal recommendations, and invest in solar projects."
                            : role.currentKey?.includes("Lister")
                                ? "The lister role allows you to list your solar projects on our marketplace and get them funded by investors."
                                : "Select a role to continue"
                }
                >
                    <SelectItem key={"Investor"} value={"investor"}>Investor</SelectItem>
                    <SelectItem key={"Lister"} value={"lister"}>Lister</SelectItem>
                </Select>
                {/*{role.currentKey?.includes("investor") && (<p className={"text-sm text-gray-500"}>*/}
                {/*    {"The investor role allows you to visit our marketplace, get personal recommendations, and invest in solar projects."}*/}
                {/*</p>)}*/}
                {/*{role.currentKey?.includes("lister") && (<p className={"text-sm text-gray-500"}>*/}
                {/*    {"The lister role allows you to list your solar projects on our marketplace and get them funded by investors."}*/}
                {/*</p>)}*/}
                <SubmitButton name={"Submit"} loading={loading}/>
            </div>
        </form>
    )
}

export default RoleForm