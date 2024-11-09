import MarketListing from "@/components/MarketListing";

function Page() {
  return (
    <div className={"flex flex-row w-full max-w-full px-8 justify-between"}>
        <MarketListing imageSrc={"/images/example1.webp"} title={"Market Listing 1"} solarScore={3}/>
        <MarketListing imageSrc={"/images/example2.webp"} title={"Market Listing 2"} solarScore={5}/>
        <MarketListing imageSrc={"/images/example3.webp"} title={"Market Listing 3"} solarScore={1}/>
        <MarketListing imageSrc={"/images/example4.webp"} title={"Market Listing 4"} solarScore={4}/>
    </div>
  );
}

export default Page;