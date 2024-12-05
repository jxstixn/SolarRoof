"use client"
import {useState} from "react";
import {SharedSelection} from "@nextui-org/react";
import RoleForm from "@/components/dashboard/RoleForm";
import PreferencesForm from "@/components/dashboard/PreferencesForm";
import {Schema} from "@/amplify/data/resource";
import {generateClient} from "@aws-amplify/api";
import {useRouter} from "next/navigation";
import Loader from "@/components/Loader";

const client = generateClient<Schema>()

interface InitialSetupProps {
    sub: string,
    email: string
}

function InitialSetup({sub, email}: InitialSetupProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [step, setStep] = useState<"ROLE" | "PREFERENCES" | "DONE">("ROLE");
    const [role, setRole] = useState<"Investor" | "Lister">("Investor");

    async function submitUser(preferences?: {
        projectType: string[],
        roofType: string[],
        solarScore: number[]
        price: number[]
        location: SharedSelection
    }) {
        setLoading(true)
        let user;

        if (preferences) {
            const locations = Array.from(preferences.location).map((location) => location)

            user = {
                id: sub,
                email: email,
                role: role,
                preferences: JSON.stringify({
                    projectType: preferences.projectType,
                    roofType: preferences.roofType,
                    solarScore: preferences.solarScore,
                    price: preferences.price,
                    location: locations
                })
            }
        } else {
            user = {
                id: sub,
                email: email,
                role: role
            }
        }

        await client.models.User.create(user)

        setLoading(false)
        setStep("DONE")
        router.refresh()
    }

    switch (step) {
        case "ROLE":
            return (
                <RoleForm
                    loading={loading}
                    setLoading={setLoading}
                    role={role}
                    setRole={setRole}
                    setStep={setStep}
                    submitUser={submitUser}
                />
            )
        case "PREFERENCES":
            return (
                <PreferencesForm
                    loading={loading}
                    role={role}
                    submitUser={submitUser}
                />
            )
        case "DONE":
            return <Loader className={"shadow-md"}/>
    }

}

export default InitialSetup