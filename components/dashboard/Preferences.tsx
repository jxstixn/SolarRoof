"use client"

import {SharedSelection, Slider} from "@nextui-org/react";
import {useState} from "react";
import RoofType from "@/components/marketplace/RoofType";
import ProjectType from "@/components/marketplace/ProjectType";
import Location from "@/components/marketplace/Location";
import Switch from "@/components/input/Switch";
import SubmitButton from "@/components/auth/SubmitButton";
import {generateClient} from "@aws-amplify/api";
import {Schema} from "@/amplify/data/resource";

const client = generateClient<Schema>()

interface PreferencesProps {
    preferences: {
        projectType: string[],
        roofType: string[],
        solarScore: number[]
        price: number[]
        location: SharedSelection
    },
    userId: string
}

function Preferences({preferences, userId}: PreferencesProps) {
    const [edit, setEdit] = useState<boolean>(false);
    const [edited, setEdited] = useState<boolean>(false);
    const [userPreferences, setUserPreferences] = useState<{
        projectType: string[],
        roofType: string[],
        solarScore: number[]
        price: number[]
        location: SharedSelection
    }>({
        projectType: preferences.projectType,
        roofType: preferences.roofType,
        solarScore: preferences.solarScore,
        price: preferences.price,
        location: preferences.location
    })

    async function saveChanges() {
        if (!edited) return
        if (JSON.stringify(preferences) === JSON.stringify(userPreferences)) return

        // Save changes
        const locations = Array.from(userPreferences.location).map((location) => location)

        const updatedPreferences = {
            projectType: userPreferences.projectType,
            roofType: userPreferences.roofType,
            solarScore: userPreferences.solarScore,
            price: userPreferences.price,
            location: locations
        }

        const {errors} = await client.models.User.update({id: userId, preferences: JSON.stringify(updatedPreferences)})

        if (errors) {
            alert(errors[0].message)
        }

        setEdited(false)
        setEdit(false)

        window.location.reload()
    }

    return (
        <div
            className={"flex flex-col bg-white w-full max-w-96 h-[420px] max-h-[420px] min-w-[300px] rounded-3xl p-4 gap-2 animate-fade-in-up shadow-md"}>
            <form className={"flex flex-col w-full gap-4"} action={saveChanges} noValidate>
                <div className={"flex flex-row w-full justify-between"}>
                    <h1 className={"text-xl font-bold"}>Preferences</h1>
                    {edited ? <SubmitButton className={"h-full min-w-16"} name={"Save"}/> :
                        <Switch checked={!edit} onChange={() => setEdit(!edit)}/>}
                </div>
                <div className={"flex flex-row w-full justify-between"}>
                    <RoofType value={userPreferences.roofType} disabled={!edit}
                              onValueChange={(value) => {
                                  setUserPreferences({...userPreferences, roofType: value})
                                  setEdited(true)
                              }}/>
                    <ProjectType value={userPreferences.projectType} disabled={!edit}
                                 onValueChange={(value) => {
                                     setUserPreferences({...userPreferences, projectType: value})
                                     setEdited(true)
                                 }}/>
                </div>
                <Slider
                    isDisabled={!edit}
                    label={<p className={"text-lg font-semibold text-black"}>Price</p>}
                    step={1000}
                    minValue={0}
                    maxValue={50000}
                    value={userPreferences.price}
                    onChange={(value) => {
                        setUserPreferences({...userPreferences, price: (value as number[])})
                        setEdited(true)
                    }}
                    formatOptions={{style: "currency", currency: "EUR"}}
                    showTooltip={true}
                    renderThumb={(props) => (
                        <div
                            {...props}
                            className="group p-1 top-1/2 bg-[#0e4155] shadow-medium rounded-full cursor-grab data-[dragging=true]:cursor-grabbing"
                        >
                                <span
                                    className="transition-transform bg-white shadow-small rounded-full w-4 h-4 block group-data-[dragging=true]:scale-80"/>
                        </div>
                    )}
                />
                <Slider
                    isDisabled={!edit}
                    label={<p className={"text-lg font-semibold text-black"}>Solar Score</p>}
                    step={1}
                    minValue={1}
                    maxValue={5}
                    value={userPreferences.solarScore}
                    onChange={(value) => {
                        setUserPreferences({...userPreferences, solarScore: (value as number[])})
                        setEdited(true)
                    }}
                    getValue={(value) => {
                        const [min, max] = value.toString().split(",");
                        return min + ' - ' + max;
                    }}
                    showTooltip={true}
                    showSteps={true}
                    renderThumb={(props) => (
                        <div
                            {...props}
                            className="group p-1 top-1/2 bg-[#0e4155] shadow-medium rounded-full cursor-grab data-[dragging=true]:cursor-grabbing"
                        >
                                <span
                                    className="transition-transform bg-white shadow-small rounded-full w-4 h-4 block group-data-[dragging=true]:scale-80"/>
                        </div>
                    )}
                />
                <Location
                    disabled={!edit}
                    selectedKeys={userPreferences.location as unknown as string[]}
                    onSelectionChange={(keys) => {
                        setUserPreferences({...userPreferences, location: keys})
                        setEdited(true)
                    }
                    }/>
            </form>
        </div>
    );
}

export default Preferences;