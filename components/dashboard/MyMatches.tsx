"use client"
import {ScrollShadow} from "@nextui-org/react";
import React, {useEffect, useState} from "react";
import {fetchMatchingInvestors} from "@/actions/zod/investors";
import type {SelectionSet} from "aws-amplify/api";
import {Schema} from "@/amplify/data/resource";
import Loader from "@/components/Loader";
import MyMatch from "@/components/dashboard/MyMatch";

const selectionSetListing = ['id', 'title', 'description', 'country', 'street', 'city', 'postalCode', 'roofType', 'projectType', 'ownerId', 'images', 'price', 'solarScore'] as const;
type Listing = SelectionSet<Schema['Listing']['type'], typeof selectionSetListing>;

const selectionSetUser = ['id', 'preferences', 'email'] as const;
type User = SelectionSet<Schema['User']['type'], typeof selectionSetUser>;

type Match = {
    investor: User,
    listing: Listing
};

function MyMatches() {
    const [loading, setLoading] = useState(true);
    const [matches, setMatches] = useState<Match[]>([]);

    useEffect(() => {
        fetchMatchingInvestors()
            .then(setMatches)
            .finally(() => setLoading(false));
    }, []);

    return (
        <div
            className={"flex flex-col bg-white w-full max-w-96 min-w-[300px] h-[420px] max-h-[420px] rounded-3xl p-4 gap-2 animate-fade-in-up shadow-md"}>
            <h1 className={"text-xl font-bold"}>Potential Investors</h1>
            {loading ? <Loader/> :
            <ScrollShadow className={"flex flex-col h-full w-full gap-2 overflow-x-hidden shadow-none"}>
                {matches.map((match, index) => (
                    <div className={"w-full animate-fade-in-up"} key={index}>
                        <MyMatch match={match}/>
                    </div>
                ))}
            </ScrollShadow>
            }
        </div>
    )
}

export default MyMatches