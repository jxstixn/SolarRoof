"use client"
import {ScrollShadow} from "@nextui-org/react";
import {Schema} from "@/amplify/data/resource";
import {generateClient} from "@aws-amplify/api";
import MarketListing from "@/components/marketplace/MarketListing";
import {useEffect, useState, useCallback} from "react";
import Loader from "@/components/Loader";

type Listing = Schema["Listing"]["type"];

const client = generateClient<Schema>();

function Recommendations() {
    const [loading, setLoading] = useState(true);
    const [listings, setListings] = useState<Listing[]>([]);

    const fetchListings = useCallback(async () => {
        const {data: listings} = await client.models.Listing.list();
        return listings.sort(() => Math.random() - 0.5)
    }, []);

    useEffect(() => {
        fetchListings()
            .then(setListings)
            .finally(() => setLoading(false));
    }, [fetchListings]);

    return (
        <div
            className={"flex flex-col w-full min-w-[300px] min-h-[480px] bg-white p-4 rounded-3xl gap-2 animate-fade-in-up shadow-md"}>
            <h1 className={"text-xl font-bold"}>Recommendations</h1>
            {loading ? <Loader/> :
                <ScrollShadow
                    className={"flex flex-row h-full w-full gap-8 pb-4 overflow-x-scroll overflow-y-hidden shadow-none"}
                    orientation={"horizontal"}
                >
                    {listings.map((listing, index) => (
                        <div className={"w-full sm:w-80 animate-fade-in-up"} key={index}>
                            <MarketListing listing={listing}/>
                        </div>
                    ))}
                </ScrollShadow>
            }
        </div>
    );
}

export default Recommendations