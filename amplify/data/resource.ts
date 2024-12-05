import {type ClientSchema, a, defineData} from '@aws-amplify/backend';

const schema = a.schema({
    Listing: a.model({
            title: a.string().required(),
            description: a.string(),
            country: a.string().required(),
            street: a.string().required(),
            city: a.string().required(),
            postalCode: a.string().required(),
            solarScore: a.integer(),
            roofType: a.string().required(),
            projectType: a.string().required(),
            price: a.integer(),
            images: a.string().array(),
            verified: a.boolean().default(false),
            ownerId: a.id().required(),
            user: a.belongsTo("User", "ownerId"),
            favoritedBy: a.hasMany("FavoriteListing", "listingId"),
        }
    ).authorization(allow => [
        allow.ownerDefinedIn("ownerId").identityClaim("sub"),
        allow.groups(["Admin"]).to(["read", "create", "update", "delete"]),
        allow.authenticated().to(["read", "create"]),
    ]),
    User: a.model({
        id: a.id().required(),
        email: a.email().required(),
        role: a.enum(["Investor", "Lister"]),
        preferences: a.json(),
        favoriteListings: a.hasMany("FavoriteListing", "userId"),
        listings: a.hasMany("Listing", "ownerId"),
    }).authorization(allow => [
        allow.ownerDefinedIn("id").identityClaim("sub"),
        allow.groups(["Admin"])
    ]),
    FavoriteListing: a.model({
        listingId: a.id().required(),
        userId: a.id().required(),
        listings: a.belongsTo("Listing", "listingId"),
        users: a.belongsTo("User", "userId"),
    }).authorization(allow => [
        allow.ownerDefinedIn("userId").identityClaim("sub"),
        allow.groups(["Admin"])
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
    schema,
    authorizationModes: {
        defaultAuthorizationMode: "userPool",
    },
});