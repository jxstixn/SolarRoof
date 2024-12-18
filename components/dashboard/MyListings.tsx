"use client"
import Loader from "@/components/Loader";
import {Button, useDisclosure} from "@nextui-org/react";
import {useEffect, useState} from "react";
import {fetchMyListings} from "@/actions/zod/listings";
import AddEditListing from "@/components/dashboard/AddEditListing";

import {Schema} from "@/amplify/data/resource";
import type {SelectionSet} from "aws-amplify/api";
import MarketListing from "@/components/marketplace/MarketListing";
import {PlusIcon} from "@/components/icons/PlusIcon";

const selectionSet = ['id', 'title', 'description', 'country', 'street', 'city', 'postalCode', 'roofType', 'projectType', 'ownerId', 'images', 'price', 'solarScore'] as const;
type Listing = SelectionSet<Schema['Listing']['type'], typeof selectionSet>;

function MyListings() {
    const [loading, setLoading] = useState(true);
    const [listings, setListings] = useState<Listing[]>([]);
    const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
    const [refresh, setRefresh] = useState(false);
    const [selectedListing, setSelectedListing] = useState<Listing | undefined>();

    useEffect(() => {
        fetchMyListings()
            .then(setListings)
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (refresh) {
            setLoading(true);
            fetchMyListings()
                .then(setListings)
                .finally(() => {
                    setLoading(false);
                    setRefresh(false);
                });
        }
    }, [refresh]);

    return (
        <div
            className={"flex flex-col w-full min-w-[300px] max-w-96 sm:max-w-full max-h-[500px] sm:max-h-full bg-white p-4 rounded-3xl gap-2 animate-fade-in-up shadow-md"}>
            <div className={"flex flex-row w-full justify-between"}>
                <h1 className={"text-xl font-bold"}>My Listings</h1>
                <Button
                    className={"font-bold shadow-md"}
                    color={"primary"}
                    endContent={<PlusIcon width={24} height={24}/>}
                    size="sm"
                    isLoading={loading}
                    onPress={onOpen}
                >
                    Add Listing
                </Button>
            </div>
            {loading ? <Loader/> :
                <div
                    className={"flex flex-col sm:flex-row h-full w-full gap-8 pb-4 overflow-x-hidden sm:overflow-x-scroll overflow-y-scroll sm:overflow-y-hidden shadow-none"}
                >
                    {listings.map((listing, index) => (
                        <div className={"w-full sm:w-80 animate-fade-in-up"} key={index}>
                            <MarketListing listing={listing} onClick={() => {
                                setSelectedListing(listing);
                                onOpen();
                            }}/>
                        </div>
                    ))}
                </div>
            }
            <AddEditListing isOpen={isOpen} onOpenChange={onOpenChange} onClose={onClose} listing={selectedListing}
                            setListing={setSelectedListing} setRefresh={setRefresh}/>
        </div>
    )
}

export default MyListings;