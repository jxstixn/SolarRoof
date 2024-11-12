import {NextRequest, NextResponse} from "next/server";
import {Schema} from "@/amplify/data/resource";
type Listing = Schema["Listing"]["type"];
import {cookiesClient} from "@/utils/amplify-utils";

export async function POST (req: NextRequest) {
    const listing: Listing = await req.json();
    // apply random number between 1 and 5 to solarScore
    listing.solarScore = Math.floor(Math.random() * 5) + 1;

    // apply random price between 10000 and 50000
    listing.price = Math.floor(Math.random() * 40000) + 10000;
    console.log("Creating listing:", listing);
    try {
        const {data: result, errors} = await cookiesClient.models.Listing.create({
            name: listing.name,
            description: listing.description,
            country: listing.country,
            street: listing.street,
            city: listing.city,
            postalCode: listing.postalCode,
            solarScore: listing.solarScore,
            price: listing.price,
            images: listing.images,
        });
        const listingId = result?.id;

        if (!listingId || errors) {
            console.error("Error creating listing:", errors);
            return NextResponse.json({errors}, {status: 400});
        }

        return NextResponse.json({listingId}, {status: 201});
    } catch (error: unknown) {
        console.error("Error creating listing:", error);

        // Use a type guard to check if the error is an instance of Error
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";

        return NextResponse.json(
            {
                error: true,
                message: errorMessage,
            },
            { status: 500 }
        );
    }
}
