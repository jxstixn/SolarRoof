"use client"

import {SharedSelection, Slider} from "@nextui-org/react";
import React, {useState} from "react";
import RoofType from "@/components/marketplace/RoofType";
import ProjectType from "@/components/marketplace/ProjectType";
import Location from "@/components/marketplace/Location";
import Switch from "@/components/input/Switch";

interface PreferencesProps {
    preferences: {
        projectType: string[],
        roofType: string[],
        solarScore: number[]
        price: number[]
        location: SharedSelection
    }
}

function Preferences({preferences}: PreferencesProps) {
    const [edit, setEdit] = useState<boolean>(false);
    const [filters, setFilters] = useState<{
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

    return (
        <div
            className={"flex flex-col bg-white w-full max-w-96 h-[420px] max-h-[420px] min-w-[300px] rounded-3xl p-4 gap-2 animate-fade-in-up shadow-md"}>
            <div className={"flex flex-row w-full justify-between"}>
                <h1 className={"text-xl font-bold"}>Preferences</h1>
                <Switch checked={!edit} onChange={() => setEdit(!edit)}/>
            </div>
            <form className={"flex flex-col w-full gap-4"}>
                <div className={"flex flex-row w-full justify-between"}>
                    <RoofType value={filters.roofType} disabled={!edit}
                              onValueChange={(value) => setFilters({...filters, roofType: value})}/>
                    <ProjectType value={filters.projectType} disabled={!edit}
                                 onValueChange={(value) => setFilters({...filters, projectType: value})}/>
                </div>
                <Slider
                    isDisabled={!edit}
                    label={<p className={"text-lg font-semibold text-black"}>Price</p>}
                    step={1000}
                    minValue={0}
                    maxValue={50000}
                    value={filters.price}
                    onChange={(value) => setFilters({...filters, price: (value as number[])})}
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
                    value={filters.solarScore}
                    onChange={(value) => setFilters({...filters, solarScore: (value as number[])})}
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
                    selectedKeys={filters.location as unknown as string[]} onSelectionChange={(keys) =>
                    setFilters({...filters, location: keys})
                }/>
            </form>
        </div>
    );
}

export default Preferences;