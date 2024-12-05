"use client"
import Loader from "@/components/Loader";
import {Button, ScrollShadow, useDisclosure} from "@nextui-org/react";
import {useEffect, useState} from "react";
import {fetchMyListings} from "@/actions/zod/listings";
import {PlusIcon} from "@/components/icons/PlusIcon";
import AddListing from "@/components/dashboard/AddListing";

import {Schema} from "@/amplify/data/resource";
import type {SelectionSet} from "aws-amplify/api";
import MyListing from "@/components/dashboard/MyListing";

const selectionSet = ['title', 'description', 'country', 'street', 'city', 'postalCode', 'roofType', 'projectType', 'ownerId', 'images', 'price', 'solarScore'] as const;
type Listing = SelectionSet<Schema['Listing']['type'], typeof selectionSet>;

function MyListings() {
    const [loading, setLoading] = useState(true);
    const [listings, setListings] = useState<Listing[]>([]);
    const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();

    useEffect(() => {
        fetchMyListings()
            .then(setListings)
            .finally(() => setLoading(false));
    }, []);

    return (
        <div
            className={"flex flex-col bg-white w-full max-w-96 h-[420px] max-h-[420px] min-w-[300px] rounded-3xl gap-2 animate-fade-in-up shadow-md pr-4"}>
            <div className={"flex flex-row w-full justify-between pt-4 pl-4"}>
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
                <ScrollShadow
                    className={"flex flex-col h-full w-full gap-2 pl-4 pb-4 overflow-y-scroll overflow-x-hidden shadow-none scrollbar-hide"}
                >
                    {listings.map((listing, index) => (
                        <div className={"w-full animate-fade-in-up"} key={index}>
                            <MyListing listing={listing}/>
                        </div>
                    ))}
                </ScrollShadow>
            }
            <AddListing isOpen={isOpen} onOpenChange={onOpenChange} onClose={onClose}/>
        </div>
    )
}

export default MyListings;