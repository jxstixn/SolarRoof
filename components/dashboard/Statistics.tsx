"use client"
import React from "react";
import DoughnutChart from "@/components/dashboard/DoughnutChart";

function Statistics() {
    return (
        <div
            className={"flex flex-col bg-white w-full max-w-96 h-[420px] max-h-[420px] min-w-[300px] rounded-3xl p-4 gap-2 animate-fade-in-up shadow-md"}>
            <h1 className={"text-xl font-bold"}>Statistics</h1>
            <div className={"flex flex-col w-full h-full p-2"}>
                <DoughnutChart/>
            </div>
        </div>
    )
}

export default Statistics