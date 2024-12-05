"use client"
import MarketListing from "@/components/marketplace/MarketListing";
import ProjectType from "@/components/marketplace/ProjectType";
import React, {useMemo, useState, useEffect} from "react";
import RoofType from "@/components/marketplace/RoofType";
import {
    Button,
    Divider,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader, ScrollShadow,
    SharedSelection,
    Slider, useDisclosure
} from "@nextui-org/react";
import Location from "@/components/marketplace/Location";
import {fetchListings} from "@/actions/zod/listings";

import {Schema} from "@/amplify/data/resource";
import type {SelectionSet} from 'aws-amplify/data';
import Loader from "@/components/Loader";

const selectionSet = ['title', 'description', 'country', 'street', 'city', 'postalCode', 'roofType', 'projectType', 'ownerId', 'images', 'price', 'solarScore'] as const;
type Listing = SelectionSet<Schema['Listing']['type'], typeof selectionSet>;

function Marketplace() {
    const [loading, setLoading] = useState(true);
    const [listings, setListings] = useState<Listing[]>([]);

    useEffect(() => {
        fetchListings()
            .then(setListings)
            .finally(() => setLoading(false));
    }, []);

    const [filters, setFilters] = useState<{
        projectType: string[],
        roofType: string[],
        solarScore: number[]
        price: number[]
        location: SharedSelection
    }>({
        projectType: ["open", "roof"],
        roofType: ["flat", "sloped", "pitched"],
        solarScore: [1, 5],
        price: [0, 50000],
        location: new Set([])
    });
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    const filteredListings = useMemo(() => {
        if (!listings) {
            return [];
        }
        return listings.filter(listing => {
            if (!listing.solarScore || !listing.price) {
                return false;
            }
            if (!filters.projectType.includes(listing.projectType)) {
                return false;
            }
            if (!filters.roofType.includes(listing.roofType)) {
                return false;
            }
            if (listing.solarScore < filters.solarScore[0] || listing.solarScore > filters.solarScore[1]) {
                return false;
            }
            if (listing.price < filters.price[0] || listing.price > filters.price[1]) {
                return false;
            }
            // return true
            return Array.from(filters.location).length !== 0 ? Array.from(filters.location).includes(listing.country.toLowerCase()) : true;

        });
    }, [listings, filters]);

    return (
        <div id={"wrapper"} className={"flex flex-col lg:flex-row w-full h-full max-h-full max-w-[1500px]"}>
            <div className={"lg:hidden flex flex-row w-full justify-between px-8 animate-fade-in-up"}>
                <h1 className={"text-4xl font-bold"}>Marketplace</h1>
                <Button color={"primary"} onClick={onOpen}>Filters</Button>
            </div>
            <div className={"hidden lg:flex flex-col w-[22rem] pl-8 gap-4 pt-4 animate-fade-in-up"}>
                <div className={"flex flex-col gap-4"}>
                    <h1 className={"text-4xl font-bold"}>Marketplace</h1>
                    <p className={"text-lg hyphens-auto"}>Find the best solar panel installation opportunities in your
                        area.</p>
                </div>
                <div id={"filters"}
                     className={"flex flex-col bg-white w-full rounded-3xl p-4 gap-2 animate-fade-in-up"}>
                    <h1 className={"text-xl font-bold"}>Filters</h1>
                    <Divider/>
                    <div id={"filterWrapper"} className={"flex flex-col w-full gap-4"}>
                        <RoofType value={filters.roofType}
                                  onValueChange={(value) => setFilters({...filters, roofType: value})}/>
                        <ProjectType value={filters.projectType}
                                     onValueChange={(value) => setFilters({...filters, projectType: value})}/>
                        <Slider
                            label={<p className={"text-lg font-semibold text-black"}>Price</p>}
                            step={1000}
                            minValue={0}
                            maxValue={50000}
                            value={filters.price}
                            onChange={(value) => setFilters({...filters, price: (value as number[])})}
                            formatOptions={{style: "currency", currency: "EUR"}}
                            showTooltip={true}
                            renderThumb={(props) => (
                                <div
                                    {...props}
                                    className="group p-1 top-1/2 bg-[#0e4155] shadow-medium rounded-full cursor-grab data-[dragging=true]:cursor-grabbing"
                                >
                                <span
                                    className="transition-transform bg-white shadow-small rounded-full w-4 h-4 block group-data-[dragging=true]:scale-80"/>
                                </div>
                            )}
                        />
                        <Slider
                            label={<p className={"text-lg font-semibold text-black"}>Solar Score</p>}
                            step={1}
                            minValue={1}
                            maxValue={5}
                            value={filters.solarScore}
                            onChange={(value) => setFilters({...filters, solarScore: (value as number[])})}
                            getValue={(value) => {
                                const [min, max] = value.toString().split(",");
                                return min + ' - ' + max;
                            }}
                            showTooltip={true}
                            showSteps={true}
                            renderThumb={(props) => (
                                <div
                                    {...props}
                                    className="group p-1 top-1/2 bg-[#0e4155] shadow-medium rounded-full cursor-grab data-[dragging=true]:cursor-grabbing"
                                >
                                <span
                                    className="transition-transform bg-white shadow-small rounded-full w-4 h-4 block group-data-[dragging=true]:scale-80"/>
                                </div>
                            )}
                        />
                        <Location selectedKeys={filters.location as unknown as string[]} onSelectionChange={(keys) =>
                            setFilters({...filters, location: keys})
                        }/>
                    </div>
                </div>
            </div>
            {loading ? <div className={"flex flex-row w-full h-full justify-center items-center"}>
                <Loader/>
            </div> : <ScrollShadow className={"flex flex-row flex-wrap gap-4 w-full h-full py-4 px-8 overflow-auto"}>
                {filteredListings.map((listing, index) => (
                    <div className={"w-full sm:w-80 animate-fade-in-up"} key={index}>
                        <MarketListing listing={listing}/>
                    </div>
                ))}
            </ScrollShadow>
            }

            <Modal
                isOpen={isOpen}
                placement={"bottom-center"}
                onOpenChange={onOpenChange}
            >
                <ModalContent>
                    <ModalHeader className="flex flex-col font-bold gap-1">Filter</ModalHeader>
                    <ModalBody>
                        <form id={"mobileFilterWrapper"} className={"flex flex-col w-full gap-4"}>
                            <RoofType value={filters.roofType}
                                      onValueChange={(value) => setFilters({...filters, roofType: value})}/>
                            <ProjectType value={filters.projectType}
                                         onValueChange={(value) => setFilters({...filters, projectType: value})}/>
                            <Slider
                                name={"price"}
                                label={<p className={"text-lg font-bold text-black"}>Price</p>}
                                step={1000}
                                minValue={0}
                                maxValue={50000}
                                value={filters.price}
                                onChange={(value) => setFilters({...filters, price: (value as number[])})}
                                formatOptions={{style: "currency", currency: "EUR"}}
                                showTooltip={true}
                                renderThumb={(props) => (
                                    <div
                                        {...props}
                                        className="group p-1 top-1/2 bg-[#0e4155] shadow-medium rounded-full cursor-grab data-[dragging=true]:cursor-grabbing"
                                    >
                                <span
                                    className="transition-transform bg-white shadow-small rounded-full w-4 h-4 block group-data-[dragging=true]:scale-80"/>
                                    </div>
                                )}
                            />
                            <Slider
                                label={<p className={"text-lg font-bold text-black"}>Solar Score</p>}
                                step={1}
                                minValue={1}
                                maxValue={5}
                                value={filters.solarScore}
                                onChange={(value) => setFilters({...filters, solarScore: (value as number[])})}
                                getValue={(value) => {
                                    const [min, max] = value.toString().split(",");
                                    return min + ' - ' + max;
                                }}
                                showTooltip={true}
                                showSteps={true}
                                renderThumb={(props) => (
                                    <div
                                        {...props}
                                        className="group p-1 top-1/2 bg-[#0e4155] shadow-medium rounded-full cursor-grab data-[dragging=true]:cursor-grabbing"
                                    >
                                <span
                                    className="transition-transform bg-white shadow-small rounded-full w-4 h-4 block group-data-[dragging=true]:scale-80"/>
                                    </div>
                                )}
                            />
                            <Location
                                selectedKeys={filters.location as unknown as string[]}
                                onSelectionChange={(keys) =>
                                    setFilters({...filters, location: keys})
                                }/>
                        </form>
                    </ModalBody>
                    <ModalFooter>
                        <Button type={"submit"} color={"primary"} onClick={onOpenChange} fullWidth>Apply</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}

export default Marketplace;