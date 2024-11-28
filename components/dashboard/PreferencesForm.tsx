import {SharedSelection, Slider} from "@nextui-org/react";
import {redirect} from "next/navigation";
import RoofType from "@/components/marketplace/RoofType";
import ProjectType from "@/components/marketplace/ProjectType";
import Location from "@/components/marketplace/Location";
import React, {useState} from "react";
import SubmitButton from "@/components/auth/SubmitButton";

interface PreferencesFormProps {
    loading: boolean,
    role: "Investor" | "Lister",
    submitUser: (preferences: {
        projectType: string[],
        roofType: string[],
        solarScore: number[]
        price: number[]
        location: SharedSelection
    }) => void
}

function PreferencesForm({loading, role, submitUser}: PreferencesFormProps) {
    const [preferences, setPreferences] = useState<{
        projectType: string[],
        roofType: string[],
        solarScore: number[]
        price: number[]
        location: SharedSelection
    }>({
        projectType: ["open", "roof"],
        roofType: ["flat", "sloped", "pitched"],
        solarScore: [1, 5],
        price: [0, 50000],
        location: new Set([])
    });

    switch (role) {
        case "Investor":
            return (
                <form action={() => {
                    submitUser(preferences)
                }} noValidate
                      className="flex flex-col w-full h-full max-h-full items-center justify-center text-zinc-800 text-md overflow-hidden p-8 animate-fade-in-up">
                    <div className={"flex flex-col bg-white w-full sm:w-96 rounded-3xl p-4 gap-4 shadow-md"}>
                        <div className={"flex flex-col"}>
                            <h1 className={"font-bold text-lg"}>{"Investor it is!"}</h1>
                            <p className={
                                "text-sm text-gray-500"
                            }>{"Please enter your preferences now"}</p>
                        </div>
                        <div className={"flex flex-col w-full gap-4"}>
                            <div className={"flex flex-row w-full justify-between"}>
                                <RoofType value={preferences.roofType}
                                          onValueChange={(value) => setPreferences({...preferences, roofType: value})}/>
                                <ProjectType value={preferences.projectType}
                                             onValueChange={(value) => setPreferences({
                                                 ...preferences,
                                                 projectType: value
                                             })}/>
                            </div>
                            <Slider
                                id={"price"}
                                name={"price"}
                                label={<p className={"text-lg font-semibold text-black"}>Price</p>}
                                step={1000}
                                minValue={0}
                                maxValue={50000}
                                value={preferences.price}
                                onChange={(value) => setPreferences({...preferences, price: (value as number[])})}
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
                                id={"solarScore"}
                                name={"solarScore"}
                                label={<p className={"text-lg font-semibold text-black"}>Solar Score</p>}
                                step={1}
                                minValue={1}
                                maxValue={5}
                                value={preferences.solarScore}
                                onChange={(value) => setPreferences({...preferences, solarScore: (value as number[])})}
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
                                selectedKeys={preferences.location as unknown as string[]} onSelectionChange={(keys) =>
                                setPreferences({...preferences, location: keys})
                            }/>
                            <SubmitButton name={"Submit"} loading={loading}/>
                        </div>
                    </div>
                </form>
            )
        case "Lister":
            return (
                <div>
                    <p>{"This is still a WIP, please select the Investor role for now"}</p>
                </div>
            )
        default:
            // refresh the page
            redirect(window.location.pathname)
    }
}

export default PreferencesForm