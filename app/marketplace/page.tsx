import React from "react";
import Marketplace from "@/components/marketplace/Marketplace";
import {cookiesClient} from "@/utils/amplify-utils";

async function Page() {
    const {data: listings}= await cookiesClient.models.Listing.list();

    return <Marketplace listings={listings}/>
}

export default Page;