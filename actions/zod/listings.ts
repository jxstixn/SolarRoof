"use server"
import {z} from "zod";
import {AuthGetCurrentUserServer, cookiesClient, StorageGetUrlServer, StorageRemoveServer} from "@/utils/amplify-utils";
import {Schema} from "@/amplify/data/resource";
import type {SelectionSet} from 'aws-amplify/data';

const selectionSet = ['id', 'title', 'description', 'country', 'street', 'city', 'postalCode', 'roofType', 'projectType', 'ownerId', 'images', 'price', 'solarScore'] as const;
type Listing = SelectionSet<Schema['Listing']['type'], typeof selectionSet>;

const listingSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    country: z.string().min(1),
    street: z.string().min(1),
    city: z.string().min(1),
    postalCode: z.string().min(1),
    roofType: z.string().min(1),
    projectType: z.string().min(1),
    ownerId: z.string().min(1),
});

export async function fetchListings(): Promise<Listing[]> {
    const {data: listings} = await cookiesClient.models.Listing.list({
        selectionSet: selectionSet,
        authMode: "iam"
    });

    const listingsWithImages = await Promise.all(listings.map(fetchListingWithImage));

    return listingsWithImages.sort((a, b) => a.title.localeCompare(b.title));
}

export async function fetchListingsWithoutMatches(): Promise<Listing[]> {
    const user = await AuthGetCurrentUserServer();

    if (!user) {
        return [];
    }

    const {data: listings} = await cookiesClient.models.Listing.list({
        selectionSet: selectionSet,
    });

    // Fetch pending matches
    const {data: matches} = await cookiesClient.models.Matches.list({
        selectionSet: ['id', 'listingId'] as const,
        filter: {status: {eq: "Pending"}},
    });

    const listingsWithoutMatches = listings.filter(listing => {
        return !matches.some(match => match.listingId === listing.id);
    });

    const listingsWithImages = await Promise.all(listingsWithoutMatches.map(fetchListingWithImage));

    return listingsWithImages.sort((a, b) => a.title.localeCompare(b.title));
}

export async function fetchListingWithImage(listing: Listing): Promise<Listing> {
    if (!listing.images) return listing;

    const imageUrls = await Promise.all(listing.images.map(async image => {
        if (!image) return null
        const url = await StorageGetUrlServer(image);
        if (!url) return null
        return url.url.toString();
    }));

    return {...listing, images: imageUrls};
}

export async function fetchMyListings(): Promise<Listing[]> {
    const user = await AuthGetCurrentUserServer();
    const {data: listings} = await cookiesClient.models.Listing.list({
        selectionSet: selectionSet,
        filter: {ownerId: {eq: user!.userId}}
    });

    const listingsWithImages = await Promise.all(listings.map(fetchListingWithImage));

    return listingsWithImages.sort((a, b) => a.title.localeCompare(b.title));
}

export async function createListing(formData: FormData) {
    const user = await AuthGetCurrentUserServer();

    if (!user) {
        return {error: {error: "User not found"}, success: false};
    }

    formData.append("ownerId", user!.userId);

    const {data: listing, error, success} = listingSchema.safeParse(Object.fromEntries(formData.entries()));

    if (error || !success) {
        return {error: error.flatten().fieldErrors, success: success};
    }

    const {data, errors} = await cookiesClient.models.Listing.create({
        ...listing,
        images: [],
        price: Math.floor(Math.random() * 40000) + 10000,
        solarScore: Math.floor(Math.random() * 5) + 1,
    });

    if (errors) {
        return {error: {error: errors.toString()}, success: false};
    }

    return {listingId: data?.id, success: true};
}

export async function updateListing(listingId: string, formData: FormData) {
    const user = await AuthGetCurrentUserServer();

    if (!user) {
        return {error: {error: "User not found"}, success: false};
    }

    formData.append("ownerId", user!.userId);

    const {data: listing, error, success} = listingSchema.safeParse(Object.fromEntries(formData.entries()));

    if (error || !success) {
        return {error: error.flatten().fieldErrors, success: success};
    }

    const {errors} = await cookiesClient.models.Listing.update({
        id: listingId,
        ...listing,
    });

    if (errors) {
        return {error: {error: errors.toString()}, success: false};
    }

    return {listingId: listingId, success: true};
}

export async function updateListingImages(listingId: string, images: string[]) {
    const {errors} = await cookiesClient.models.Listing.update({
        id: listingId,
        images,
    });

    if (errors) {
        return {error: errors, success: false};
    }

    return {success: true};
}

export async function deleteListing(listingId: string) {
    // Delete images from storage
    const listing = await cookiesClient.models.Listing.get({id: listingId});

    if (listing.data?.images) {
        await Promise.all(listing.data.images.map(async image => {
            if (image) {
                await StorageRemoveServer(image);
            }
        }));
    }

    // Delete listing from database
    const {errors} = await cookiesClient.models.Listing.delete({id: listingId});

    if (errors) {
        return {error: errors, success: false};
    }

    return {success: true};
}