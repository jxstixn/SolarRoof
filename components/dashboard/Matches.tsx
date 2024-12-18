"use client"
import React, {useEffect, useState} from "react";
import type {SelectionSet} from "aws-amplify/api";
import {Schema} from "@/amplify/data/resource";
import {fetchMatchesInvestor, fetchMatchesLister} from "@/actions/zod/matches";
import Loader from "@/components/Loader";
import {ScrollShadow, useDisclosure} from "@nextui-org/react";
import MatchItem from "@/components/dashboard/MatchItem";
import Matcher from "@/components/matcher/Matcher";

const selectionSet = ['id', 'title', 'description', 'country', 'street', 'city', 'postalCode', 'roofType', 'projectType', 'ownerId', 'images', 'price', 'solarScore'] as const;
type Listing = SelectionSet<Schema['Listing']['type'], typeof selectionSet>;

const selectionSetMatches = ['id', 'listerId', 'investorId', 'listingId', 'status', 'acceptedBy', 'rejectedBy'] as const;
type Matches = SelectionSet<Schema['Matches']['type'], typeof selectionSetMatches>;

interface MatchesProps {
    role: "Lister" | "Investor";
}

function Matches({role}: MatchesProps) {
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(false);
    const [matches, setMatches] = useState<{ match: Matches, listing: Listing }[]>([]);
    const [selectedListing, setSelectedListing] = useState<{ match: Matches, listing: Listing }>();
    const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();

    useEffect(() => {
        if (role === "Investor") {
            fetchMatchesInvestor()
                .then(setMatches)
                .finally(() => setLoading(false));
        } else {
            fetchMatchesLister()
                .then(setMatches)
                .finally(() => setLoading(false));
        }
    }, [role]);

    useEffect(() => {
        if (refresh) {
            if (role === "Investor") {
                fetchMatchesInvestor()
                    .then(setMatches)
                    .finally(() => setLoading(false));
            } else {
                fetchMatchesLister()
                    .then(setMatches)
                    .finally(() => setLoading(false));
            }
            setRefresh(false);
        }
    }, [refresh, role]);

    return (
        <div
            className={"flex flex-col bg-white w-full max-w-96 min-w-[300px] h-[420px] max-h-[420px] rounded-3xl p-4 gap-2 animate-fade-in-up shadow-md"}>
            <h1 className={"text-xl font-bold"}>Matches</h1>
            {loading ? <Loader/> :
                <ScrollShadow className={"flex flex-col h-full w-full gap-2 overflow-x-hidden shadow-none"}>
                    {matches.map((item, index) => (
                        <div className={"w-full animate-fade-in-up"} key={index}>
                            <MatchItem match={item.match} listing={item.listing} onClick={() => {
                                setSelectedListing(item);
                                onOpen();
                            }}/>
                        </div>
                    ))}
                </ScrollShadow>
            }
            <Matcher
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                onClose={() => {
                    setSelectedListing(undefined);
                    onClose();
                }}
                role={"Lister"}
                listing={selectedListing?.listing}
                matchId={selectedListing?.match.id}
                status={selectedListing?.match.status}
                investorId={selectedListing?.match.investorId}
                setRefresh={setRefresh}
            />
        </div>
    )
}

export default Matches;