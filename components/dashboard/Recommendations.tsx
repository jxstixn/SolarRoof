"use client"
import {useDisclosure} from "@nextui-org/react";
import MarketListing from "@/components/marketplace/MarketListing";
import {useEffect, useMemo, useState} from "react";
import Loader from "@/components/Loader";
import {fetchListingsWithoutMatches} from "@/actions/zod/listings";

import {Schema} from "@/amplify/data/resource";
import type {SelectionSet} from 'aws-amplify/data';
import Matcher from "@/components/matcher/Matcher";

const selectionSet = ['id', 'title', 'description', 'country', 'street', 'city', 'postalCode', 'roofType', 'projectType', 'ownerId', 'images', 'price', 'solarScore'] as const;
type Listing = SelectionSet<Schema['Listing']['type'], typeof selectionSet>;

interface RecommendationsProps {
    preferences: {
        projectType: string[],
        roofType: string[],
        solarScore: number[]
        price: number[]
        location: string[]
    }
}

function Recommendations({preferences}: RecommendationsProps) {
    const [loading, setLoading] = useState(true);
    const [selectedListing, setSelectedListing] = useState<Listing>();
    const [listings, setListings] = useState<Listing[]>([]);
    const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();

    useEffect(() => {
        fetchListingsWithoutMatches()
            .then(setListings)
            .finally(() => setLoading(false));
    }, []);

    const filteredListings = useMemo(() => {
        if (!listings) {
            return [];
        }
        return listings.filter(listing => {
            if (!listing.solarScore || !listing.price) {
                return false;
            }
            if (!preferences.projectType.includes(listing.projectType)) {
                return false;
            }
            if (!preferences.roofType.includes(listing.roofType)) {
                return false;
            }
            if (listing.solarScore < preferences.solarScore[0] || listing.solarScore > preferences.solarScore[1]) {
                return false;
            }
            if (listing.price < preferences.price[0] || listing.price > preferences.price[1]) {
                return false;
            }
            // return true
            return Array.from(preferences.location).length !== 0 ? Array.from(preferences.location).includes(listing.country.toLowerCase()) : true;

        });
    }, [listings, preferences]);

    return (
        <div
            className={"flex flex-col w-full min-w-[300px] max-w-96 sm:max-w-full max-h-[500px] sm:max-h-full bg-white p-4 rounded-3xl gap-2 animate-fade-in-up shadow-md"}>
            <h1 className={"text-xl font-bold"}>Recommendations</h1>
            {loading ? <Loader/> :
                <div
                    className={"flex flex-col sm:flex-row h-full w-full gap-8 pb-4 overflow-x-hidden sm:overflow-x-scroll overflow-y-scroll sm:overflow-y-hidden shadow-none"}
                >
                    {filteredListings.map((listing, index) => (
                        <div className={"w-full sm:w-80 animate-fade-in-up"} key={index}>
                            <MarketListing listing={listing} onClick={() => {
                                setSelectedListing(listing);
                                onOpen();
                            }}/>
                        </div>
                    ))}
                </div>
            }
            <Matcher
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                onClose={() => {
                    setSelectedListing(undefined);
                    onClose();
                }}
                listing={selectedListing}
                role={"Investor"}
            />
        </div>
    );
}

export default Recommendations