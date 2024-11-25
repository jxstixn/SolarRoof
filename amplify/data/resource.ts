import {type ClientSchema, a, defineData} from '@aws-amplify/backend';

const schema = a.schema({
    Listing: a.model({
            name: a.string().required(),
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
            user: a.belongsTo("User", "ownerId"),
            ownerId: a.id(),
            favoritedBy: a.hasMany("FavoriteListing", "listingId"),
        }
    ).authorization(allow => [
        allow.owner().identityClaim("sub").to(["read", "update", "delete"]),
        allow.groups(["Admin"]).to(["read", "create", "update", "delete"]),
        allow.authenticated().to(["read", "create"]), // Matches guest permissions
        allow.guest().to(["read", "create"]),
    ]),
    User: a.model({
        id: a.id().required(),
        email: a.string().required(),
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