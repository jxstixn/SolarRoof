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
            matches: a.hasMany("Matches", "listingId"),
        }
    ).authorization(allow => [
        allow.ownerDefinedIn("ownerId").identityClaim("sub"),
        allow.groups(["Admin"]).to(["read", "create", "update", "delete"]),
        allow.authenticated().to(["read", "create"]),
        allow.guest().to(["read"]),
    ]),
    User: a.model({
        id: a.id().required(),
        email: a.email().required(),
        role: a.enum(["Investor", "Lister"]),
        preferences: a.json(),
        listings: a.hasMany("Listing", "ownerId"),
        matchesLister: a.hasMany("Matches", "listerId"),
        matchesInvestor: a.hasMany("Matches", "investorId"),
        notifications: a.hasMany("Notification", "userId"),
    }).authorization(allow => [
        allow.ownerDefinedIn("id").identityClaim("sub"),
        allow.authenticated().to(["read"]),
        allow.groups(["Admin"])
    ]),
    Matches: a.model({
        listerId: a.id().required(),
        investorId: a.id().required(),
        listingId: a.id().required(),
        lister: a.belongsTo("User", "listerId"),
        investor: a.belongsTo("User", "investorId"),
        listing: a.belongsTo("Listing", "listingId"),
        status: a.enum(["Pending", "Accepted", "Rejected"]),
        acceptedBy: a.enum(["Lister", "Investor", "Both"]),
        rejectedBy: a.enum(["Lister", "Investor", "Both"]),
    }).authorization(allow => [
        allow.ownerDefinedIn("listerId").identityClaim("sub"),
        allow.ownerDefinedIn("investorId").identityClaim("sub"),
        allow.groups(["Admin"])
    ]),
    Notification: a.model({
        userId: a.id().required(),
        type: a.enum(["Match"]),
        message: a.string(),
        user: a.belongsTo("User", "userId"),
    }).authorization(allow => [
        allow.authenticated().to(["create"]),
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