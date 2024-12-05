import Image from "next/image";
import LocationIcon from "@/components/icons/LocationIcon";

import {Schema} from "@/amplify/data/resource";
import type {SelectionSet} from 'aws-amplify/data';

const selectionSet = ['title', 'description', 'country', 'street', 'city', 'postalCode', 'roofType', 'projectType', 'ownerId', 'images', 'price', 'solarScore'] as const;
type Listing = SelectionSet<Schema['Listing']['type'], typeof selectionSet>;

interface MarketListingProps {
    className?: string;
    listing: Listing,
}

function MarketListing({className, listing}: MarketListingProps) {
    function computeSolarScoreColor() {
        // rank them from 1 to 5 with 1 being the worst and 5 being the best
        // this should look like a progress bar with 5 different colors
        // 1 - red, 2 - orange, 3 - yellow, 4 - light green, 5 - dark green
        const colors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-300", "bg-green-500"];
        return (
            <div className={"flex flex-row w-3/5 items-center gap-1"}>
                {Array.from({length: 5}, (_, i) => {
                    if (!listing.solarScore) {
                        return (
                            <div key={i} className={"w-full h-2 bg-gray-300 rounded-full"}/>
                        )
                    }
                    return (
                        // first one should be rounded on the left, last one should be rounded on the right
                        <div key={i}
                             className={`w-full h-2 ${i < listing.solarScore ? colors[listing.solarScore - 1] : "bg-gray-300"}
                        ${i === 0 ? "rounded-l-full" : ""} ${i === 4 ? "rounded-r-full" : ""}
                        `}/>
                    )
                })}
            </div>
        )

    }

    return (
        <div
            className={"flex flex-col bg-white w-full sm:w-80 max-h-[500px] rounded-3xl p-4 drop-shadow-md gap-3 transform-all hover:scale-105 duration-300 cursor-pointer " + className}>
            <div className={"relative max-w-full w-full max-h-64 h-48"}>
                <Image
                    className={"rounded-2xl shadow-md object-center object-cover"}
                    src={listing.images ? listing.images[0] as string : "/CameraIcon.svg"}
                    alt={"Market Listing"}
                    fill
                />
            </div>
            <h1 className={"text-xl font-bold"}>{listing.title}</h1>
            <div className={"flex flex-row h-4 gap-1 items-center"}>
                <LocationIcon className={"w-4 h-4"}/>
                <p className={"text-sm font-normal"}>{listing.city}, {listing.country}</p>
            </div>
            <p key={"description"} className={"font-normal text-sm"}>
                {listing.description}
            </p>
            <div className={"flex flex-row gap-1 w-full"}>
                <span className={"font-semibold text-md w-2/5"}>Solar Score:</span>
                {computeSolarScoreColor()}
            </div>
            <div className={"flex flex-row justify-between gap-1"}>
                <span className={"font-semibold text-md"}>Price:</span>
                <span className={"font-semibold text-lg"}>{listing.price}€</span>
            </div>
        </div>
    )
}

export default MarketListing