import MarketListing from "@/components/MarketListing";

function Page() {
    return (
        <div id={"wrapper"} className={"flex flex-row"}>
            <div className={"flex flex-col w-1/4 pl-8 gap-4"}>
                <div className={"flex flex-col gap-4"}>
                    <h1 className={"text-4xl font-bold"}>Marketplace</h1>
                    <p className={"text-lg"}>Find the best solar panel installation opportunities in your area.</p>
                </div>
                <div id={"filters"} className={"flex flex-col bg-white w-full rounded-3xl"}>
                    <h1 className={"text-xl font-bold px-4 pt-4"}>Filters</h1>
                    <div id={"filter1"} className={"flex flex-col p-4"}>
                        <h1 className={"text-md font-bold"}>Solar Score</h1>
                        <div id={"slider1"} className={"flex flex-row gap-4"}>
                            <input type={"range"} min={1} max={5} step={1} defaultValue={1}/>
                            <span>1</span>
                        </div>
                        <div id={"slider2"} className={"flex flex-row gap-4"}>
                            <input type={"range"} min={1} max={5} step={1} defaultValue={5}/>
                            <span>5</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className={"flex flex-row flex-wrap gap-4 w-3/4 p-8 justify-between"}>
                <MarketListing imageSrc={"/images/example1.webp"} title={"Market Listing 1"} solarScore={3}/>
                <MarketListing imageSrc={"/images/example2.webp"} title={"Market Listing 2"} solarScore={5}/>
                <MarketListing imageSrc={"/images/example3.webp"} title={"Market Listing 3"} solarScore={1}/>
                <MarketListing imageSrc={"/images/example4.webp"} title={"Market Listing 4"} solarScore={4}/>
            </div>
        </div>
    );
}

export default Page;