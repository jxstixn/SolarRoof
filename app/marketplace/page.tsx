"use client"
import MarketListing from "@/components/MarketListing";
import ProjectType from "@/components/marketplace/ProjectType";
import React, {useState} from "react";
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

function Page() {
    const [filters, setFilters] = useState<{
        projectType: string[],
        roofType: string[],
        solarScore: number,
        price: number,
        location: SharedSelection
    }>({
        projectType: ["open", "roof"],
        roofType: ["flat", "sloped", "pitched"],
        solarScore: 0,
        price: 0,
        location: new Set([])
    });
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    const listings = [
        {
            imageSrc: "/images/example1.webp",
            title: "Market Listing 1",
            solarScore: 3
        },
        {
            imageSrc: "/images/example2.webp",
            title: "Market Listing 2",
            solarScore: 5
        },
        {
            imageSrc: "/images/example3.webp",
            title: "Market Listing 3",
            solarScore: 1
        },
        {
            imageSrc: "/images/example4.webp",
            title: "Market Listing 4",
            solarScore: 4
        }
    ];

    return (
        <div id={"wrapper"} className={"flex flex-col lg:flex-row w-full h-full max-h-full"}>
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
                <div id={"filters"} className={"flex flex-col bg-white w-full rounded-3xl p-4 gap-2 animate-fade-in-up"}>
                    <h1 className={"text-xl font-bold"}>Filters</h1>
                    <Divider/>
                    <div id={"filterWrapper"} className={"flex flex-col w-full gap-4"}>
                        <RoofType value={filters.roofType}
                                  onValueChange={(value) => setFilters({...filters, roofType: value})}/>
                        <ProjectType value={filters.projectType}
                                     onValueChange={(value) => setFilters({...filters, projectType: value})}/>
                        <Slider
                            label={<p className={"text-lg font-bold text-black"}>Price</p>}
                            step={1000}
                            minValue={0}
                            maxValue={50000}
                            defaultValue={[0, 50000]}
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
                            defaultValue={[1, 5]}
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
            <ScrollShadow className={"flex flex-row flex-wrap gap-4 w-full py-4 px-8 overflow-auto"}>
                {listings.map((listing, index) => (
                    <MarketListing key={index} imageSrc={listing.imageSrc} title={listing.title}
                                   solarScore={listing.solarScore} className={"animate-fade-in-up"}/>
                ))}
            </ScrollShadow>

            <Modal
                isOpen={isOpen}
                placement={"bottom-center"}
                onOpenChange={onOpenChange}
            >
                <ModalContent>
                    <ModalHeader className="flex flex-col font-bold gap-1">Filter</ModalHeader>
                    <ModalBody>
                        <div id={"mobileFilterWrapper"} className={"flex flex-col w-full gap-4"}>
                            <RoofType value={filters.roofType}
                                      onValueChange={(value) => setFilters({...filters, roofType: value})}/>
                            <ProjectType value={filters.projectType}
                                         onValueChange={(value) => setFilters({...filters, projectType: value})}/>
                            <Slider
                                label={<p className={"text-lg font-bold text-black"}>Price</p>}
                                step={1000}
                                minValue={0}
                                maxValue={50000}
                                defaultValue={[0, 50000]}
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
                                defaultValue={[1, 5]}
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
                            <Location selectedKeys={filters.location as unknown as string[]}
                                      onSelectionChange={(keys) =>
                                          setFilters({...filters, location: keys})
                                      }/>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color={"primary"} onClick={onOpenChange} fullWidth>Apply</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
        ;
}

export default Page;