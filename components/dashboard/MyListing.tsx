"use client"
import {Schema} from "@/amplify/data/resource";
import type {SelectionSet} from "aws-amplify/api";
import LocationIcon from "@/components/icons/LocationIcon";
import Image from "next/image";

const selectionSet = ['title', 'description', 'country', 'street', 'city', 'postalCode', 'roofType', 'projectType', 'ownerId', 'images', 'price', 'solarScore'] as const;
type Listing = SelectionSet<Schema['Listing']['type'], typeof selectionSet>;

interface MyListingProps {
    listing: Listing;
}

function MyListing({listing}: MyListingProps) {
    return (
        <div className={"flex flex-row w-full rounded-3xl shadow-md p-4 gap-4 transform-all hover:scale-[1.02] duration-300 cursor-pointer bg-white"}>
            <div className={"relative max-w-24 w-24 max-h-12 h-12 rounded"}>
                <Image
                    className={"rounded shadow-md object-center object-cover"}
                    src={listing.images ? listing.images[0] as string : "/CameraIcon.svg"}
                    alt={"Listing"}
                    fill
                />
            </div>
            <div className={"flex flex-col w-full gap-1"}>
                <h1 className={"font-bold"}>{listing.title}</h1>
                <div className={"flex flex-row h-4 gap-1 items-center"}>
                    <LocationIcon className={"w-4 h-4"}/>
                    <p className={"text-sm font-normal"}>{listing.city}, {listing.country}</p>
                </div>
            </div>
        </div>
    )
}

export default MyListing