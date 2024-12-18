"use client"
import {Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/react";

import {Schema} from "@/amplify/data/resource";
import type {SelectionSet} from 'aws-amplify/data';
import Image from "next/image";
import EmblaCarousel from "@/components/matcher/EmblaCarousel";
import LocationIcon from "@/components/icons/LocationIcon";
import {createMatchInvestor, updateMatchLister} from "@/actions/zod/matches";
import {createNotification} from "@/actions/zod/notifications";
import {useEffect, useState} from "react";
import {fetchInvestor} from "@/actions/zod/investors";
import Loader from "@/components/Loader";
import MatcherSuccess from "@/components/matcher/MatcherSuccess";
import MatcherButton from "@/components/matcher/MatcherButton";

const selectionSet = ['id', 'title', 'description', 'country', 'street', 'city', 'postalCode', 'roofType', 'projectType', 'ownerId', 'images', 'price', 'solarScore'] as const;
type Listing = SelectionSet<Schema['Listing']['type'], typeof selectionSet>;

const selectionSetUser = ['id', 'preferences', 'email'] as const;
type User = SelectionSet<Schema['User']['type'], typeof selectionSetUser>;

interface MatcherProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    onClose: () => void,
    matchId?: string,
    listing?: Listing,
    role: "Lister" | "Investor",
    investorId?: string,
    status?: "Pending" | "Accepted" | "Rejected" | null,
    setRefresh?: (refresh: boolean) => void
}

function Matcher({isOpen, onOpenChange, onClose, listing, role, investorId, matchId, setRefresh, status}: MatcherProps) {
    const [loading, setLoading] = useState(false);
    const [investor, setInvestor] = useState<User>();
    const [matched, setMatched] = useState(status == "Accepted");

    useEffect(() => {
        if (investorId) fetchInvestor(investorId).then(setInvestor)
    }, [investorId]);

    if (!listing) return null

    if (!listing.images) return null

    function computeSolarScoreColor(listing: Listing) {
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

    async function formActionInvestor(listing: Listing) {
        const {errors, success} = await createMatchInvestor(listing);

        if (errors || !success) {
            console.error(errors)
            alert("Error occurred while sending inquiry")
            setLoading(false);
            return
        }

        await createNotification(listing.ownerId, `You have a new match for ${listing.title}`);
        alert("Inquiry sent successfully")
    }

    async function formActionLister(matchId: string, listing: Listing) {
        const {errors, success} = await updateMatchLister(matchId);

        if (errors || !success) {
            console.error(errors)
            alert("Error occurred while accepting inquiry")
            setLoading(false);
            return
        }

        await createNotification(investorId as string, `You have a new match for ${listing.title}`);
        setMatched(true);
        if (setRefresh) {
            setRefresh(true);
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            onClose={() => {
                setInvestor(undefined)
                setMatched(false)
                onClose()
            }}
            scrollBehavior={"inside"}
            size={"xl"}
        >
            <ModalContent>
                <ModalHeader className={"font-bold"}>{investor && `Inquiry by ${investor.email}`}</ModalHeader>
                {(investorId && !investor) ? <ModalBody className={"overflow-hidden"}><Loader/></ModalBody>
                    : matched ?
                        <ModalBody className={"overflow-hidden"}>
                            <MatcherSuccess/>
                        </ModalBody>
                        : <ModalBody className={"overflow-y-auto"}>
                            {listing.images.length === 1 ? (
                                <Image
                                    key={listing.images[0]}
                                    className={"rounded-2xl shadow-md object-center object-cover h-48 sm:h-64 w-full"}
                                    src={listing.images[0] as string}
                                    alt={"Market Listing"}
                                    height={300}
                                    width={300}
                                />
                            ) : (
                                <EmblaCarousel slides={listing.images as string[]}
                                               title={listing.title}/>)}
                            {listing.images.length === 1 ? (
                                <h1 className={"text-xl font-bold"}>{listing.title}</h1>
                            ) : null}
                            <div className={"flex flex-row h-4 gap-1 items-center"}>
                                <LocationIcon className={"w-4 h-4"}/>
                                <p className={"text-sm font-normal"}>{listing.city}, {listing.country}</p>
                            </div>
                            <p key={"description"} className={"font-normal text-sm"}>
                                {listing.description}
                            </p>
                            <div className={"flex flex-row gap-1 w-full justify-between"}>
                                <span className={"font-semibold text-md w-2/5"}>Roof Type:</span>
                                <span className={"font-normal text-md"}>{
                                    listing.roofType === "flat" ? "Flat Roof" :
                                        listing.roofType === "pitched" ? "Pitched Roof" :
                                            listing.roofType === "sloped" ? "Sloped Roof" : "Other"
                                }</span>
                            </div>
                            <div className={"flex flex-row gap-1 w-full justify-between"}>
                                <span className={"font-semibold text-md w-2/5"}>Project Type:</span>
                                <span className={"font-normal text-md"}>{
                                    listing.projectType === "roof" ? "Roof Space" :
                                        "Open Space"
                                }</span>
                            </div>
                            <div className={"flex flex-row gap-1 w-full"}>
                                <span className={"font-semibold text-md w-2/5"}>Solar Score:</span>
                                {computeSolarScoreColor(listing)}
                            </div>
                            <div className={"flex flex-row justify-between gap-1"}>
                                <span className={"font-semibold text-md"}>Price:</span>
                                <span className={"font-semibold text-lg"}>{listing.price}€</span>
                            </div>
                        </ModalBody>
                }
                <ModalFooter>
                    {((investorId && !investor) || matched) ? null :
                        (<form action={() => {
                            setLoading(true)
                            if (role === "Investor") {
                             formActionInvestor(listing)
                                .then(() => setLoading(false))
                                .finally(onClose)
                            } else {
                                formActionLister(matchId!, listing)
                                    .then(() => setLoading(false))
                            }
                        }} className={"flex flex-row w-full gap-4"}>
                            <MatcherButton
                                loading={loading}
                                name={role === "Investor" ? "Inquire" : "Accept"}>
                            </MatcherButton>
                            <Button
                                className={"font-bold text-danger shadow-sm"} isDisabled={loading}
                                onClick={onClose} fullWidth variant={"flat"} color={"danger"}>Reject</Button>
                        </form>)}
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default Matcher