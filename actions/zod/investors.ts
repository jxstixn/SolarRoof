"use server"
import {Schema} from "@/amplify/data/resource";
import type {SelectionSet} from 'aws-amplify/data';
import {cookiesClient} from "@/utils/amplify-utils";
import {fetchMyListings} from "@/actions/zod/listings";

const selectionSetListing = ['id', 'title', 'description', 'country', 'street', 'city', 'postalCode', 'roofType', 'projectType', 'ownerId', 'images', 'price', 'solarScore'] as const;
type Listing = SelectionSet<Schema['Listing']['type'], typeof selectionSetListing>;

const selectionSetUser = ['id', 'preferences', 'email'] as const;
type User = SelectionSet<Schema['User']['type'], typeof selectionSetUser>;

export async function fetchMatchingInvestors() {
// Fetch My Listings
    const listings: Listing[] = await fetchMyListings();

    // Fetch all users
    const {data: users} = await cookiesClient.models.User.list({
        selectionSet: selectionSetUser,
        filter: {role: {eq: 'Investor'}},
    });

    // Prepare a result array
    const matches = users
        .map(user => {
            if (!user || !user.preferences) return null;
            const preferences = JSON.parse(user.preferences as string);

            // Find the best matching listing
            let bestMatch: Listing | null = null;
            let bestMatchScore = -Infinity;

            listings.forEach(listing => {
                if (
                    listing &&
                    listing.solarScore &&
                    listing.price &&
                    preferences.projectType.includes(listing.projectType) &&
                    preferences.roofType.includes(listing.roofType) &&
                    listing.solarScore >= preferences.solarScore[0] &&
                    listing.solarScore <= preferences.solarScore[1] &&
                    listing.price >= preferences.price[0] &&
                    listing.price <= preferences.price[1] &&
                    (preferences.location.length === 0 || preferences.location.includes(listing.country.toLowerCase()))
                ) {
                    // Calculate a score for this match (e.g., based on solarScore closeness, price range)
                    const score =
                        (listing.solarScore - preferences.solarScore[0]) +
                        (preferences.solarScore[1] - listing.solarScore) +
                        (preferences.price[1] - listing.price);

                    if (score > bestMatchScore) {
                        bestMatchScore = score;
                        bestMatch = listing;
                    }
                }
            });

            // If a match is found, return the investor and the best listing
            return bestMatch ? {investor: user as User, listing: bestMatch as Listing} : null;
        })
        .filter(Boolean); // Remove null entries

    return matches as {investor: User, listing: Listing}[];
}

export async function fetchInvestor(investorId: string) {
    const {data: investor} = await cookiesClient.models.User.get({id: investorId}, {selectionSet: selectionSetUser});
    return investor as User;
}