"use server"
import {AuthGetCurrentUserServer, cookiesClient} from "@/utils/amplify-utils";
import {Schema} from "@/amplify/data/resource";
import type {SelectionSet} from 'aws-amplify/data';
import {fetchListingWithImage} from "@/actions/zod/listings";

const selectionSet = ['id', 'title', 'description', 'country', 'street', 'city', 'postalCode', 'roofType', 'projectType', 'ownerId', 'images', 'price', 'solarScore'] as const;
type Listing = SelectionSet<Schema['Listing']['type'], typeof selectionSet>;

const selectionSetMatches = ['id', 'listerId', 'investorId', 'listingId', 'status', 'acceptedBy', 'rejectedBy'] as const;
type Matches = SelectionSet<Schema['Matches']['type'], typeof selectionSetMatches>;

export async function createMatchInvestor(listing: Listing) {
    const user = await AuthGetCurrentUserServer();
    const investorId = user?.userId;

    if (!user || !investorId) {
        return {errors: {error: "User not found"}, success: false};
    }

    const {data: match, errors} = await cookiesClient.models.Matches.create({
        listingId: listing.id,
        investorId: investorId,
        listerId: listing.ownerId,
        status: "Pending",
        acceptedBy: "Investor"
    });

    if (errors) {
        return {error: {errors: errors.toString()}, success: false};
    }

    return {matchId: match?.id, success: true};
}

export async function fetchMatchesInvestor(): Promise<{ match: Matches, listing: Listing }[]> {
    const user = await AuthGetCurrentUserServer();

    const {data: matches} = await cookiesClient.models.Matches.list({
        selectionSet: selectionSetMatches,
        filter: {investorId: {eq: user?.userId}},
    });

    const matchesWithListings = await Promise.all(matches.map(async match => {
        const {data: listing} = await cookiesClient.models.Listing.get({id: match.listingId}, {selectionSet})
        if (!listing) return null
        return {match, listing}
    }));

    return matchesWithListings.filter(match => match !== null);
}

export async function fetchMatchesLister(): Promise<{ match: Matches, listing: Listing }[]> {
    const user = await AuthGetCurrentUserServer();

    const {data: matches} = await cookiesClient.models.Matches.list({
        selectionSet: selectionSetMatches,
        filter: {listerId: {eq: user?.userId}},
    });

    const matchesWithListings = await Promise.all(matches.map(async match => {
        const {data: listing} = await cookiesClient.models.Listing.get({id: match.listingId}, {selectionSet})
        if (!listing) return null
        const listingWithImage = await fetchListingWithImage(listing);
        return {match: match, listing: listingWithImage}
    }));

    return matchesWithListings.filter(match => match !== null);
}

export async function updateMatchLister(matchId: string) {
    const user = await AuthGetCurrentUserServer();

    if (!user) {
        return {errors: {error: "User not found"}, success: false};
    }

    if (!matchId) {
        return {errors: {error: "Match not found"}, success: false};
    }

    const {errors} = await cookiesClient.models.Matches.update({id: matchId, status: "Accepted", acceptedBy: "Both"});

    if (errors) {
        return {errors: {errors: errors.toString()}, success: false};
    }

    return {success: true};
}