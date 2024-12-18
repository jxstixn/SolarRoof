"use client"
import {Schema} from "@/amplify/data/resource";
import type {SelectionSet} from "aws-amplify/api";
import Image from "next/image";

const selectionSetListing = ['id', 'title', 'description', 'country', 'street', 'city', 'postalCode', 'roofType', 'projectType', 'ownerId', 'images', 'price', 'solarScore'] as const;
type Listing = SelectionSet<Schema['Listing']['type'], typeof selectionSetListing>;

const selectionSetUser = ['id', 'preferences', 'email'] as const;
type User = SelectionSet<Schema['User']['type'], typeof selectionSetUser>;

type Match = {
    investor: User,
    listing: Listing
}

interface MyMatchProps {
    match: Match
}

function MyMatch({match}: MyMatchProps) {
    return (
        <div
            className={"flex flex-row w-full rounded-3xl shadow-md p-4 gap-4 transform-all hover:scale-[1.02] duration-300 cursor-pointer bg-white"}>
            <div className={"relative max-w-24 w-24 max-h-12 h-12 rounded"}>
                <Image
                    className={"rounded shadow-md object-center object-cover"}
                    src={match.listing.images ? match.listing.images[0] as string : "/CameraIcon.svg"}
                    alt={"Listing"}
                    fill
                />
            </div>
            <div className={"flex flex-col w-full gap-1"}>
                <h1 className={"font-bold"}>{match.listing.title}</h1>
                <div className={"flex flex-row h-4 gap-1 items-center"}>
                    <p className={"text-sm font-normal"}>{match.investor.email}</p>
                </div>
            </div>
        </div>
    )
}

export default MyMatch