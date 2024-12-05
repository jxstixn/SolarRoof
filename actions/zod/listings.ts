"use server"
import {z} from "zod";
import {AuthGetCurrentUserServer, cookiesClient, StorageGetUrlServer} from "@/utils/amplify-utils";
import {Schema} from "@/amplify/data/resource";
import type {SelectionSet} from 'aws-amplify/data';

const selectionSet = ['title', 'description', 'country', 'street', 'city', 'postalCode', 'roofType', 'projectType', 'ownerId', 'images', 'price', 'solarScore'] as const;
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
    });

    // Fetch all URLs for images
    const imageUrls = await Promise.all(listings.map(async listing => {
        if (listing.images?.[0]) {
            return await StorageGetUrlServer(listing.images?.[0]);
        }
        return null;
    }));

    // Assign image URLs to listings
    return listings.map((listing, index) => {
        if (!imageUrls[index]) {
            return listing;
        }
        return {...listing, images: [imageUrls[index].url.toString()]};
    }).sort((a, b) => a.title.localeCompare(b.title));
}

export async function fetchMyListings(): Promise<Listing[]> {
    const user = await AuthGetCurrentUserServer();
    const {data: listings} = await cookiesClient.models.Listing.list({
        selectionSet: selectionSet,
        filter: {ownerId: {eq: user!.userId}}
    });

    // Fetch all URLs for images
    const imageUrls = await Promise.all(listings.map(async listing => {
        if (listing.images?.[0]) {
            return await StorageGetUrlServer(listing.images?.[0]);
        }
        return null;
    }));

    // Assign image URLs to listings
    return listings.map((listing, index) => {
        if (!imageUrls[index]) {
            return listing;
        }
        return {...listing, images: [imageUrls[index].url.toString()]};
    }).sort((a, b) => a.title.localeCompare(b.title));
}

export async function createListing(formData: FormData) {
    const user = await AuthGetCurrentUserServer();

    if (!user) {
        return {error: "User not found", success: false};
    }

    formData.append("ownerId", user!.userId);

    const {data: listing, error, success} = listingSchema.safeParse(Object.fromEntries(formData.entries()));

    if (error || !success) {
        return {error: error, success: success};
    }

    const {data, errors} = await cookiesClient.models.Listing.create({
        ...listing,
        images: [],
        price: Math.floor(Math.random() * 40000) + 10000,
        solarScore: Math.floor(Math.random() * 5) + 1,
    });

    if (errors) {
        return {error: errors, success: false};
    }

    return {listingId: data?.id, success: true};
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