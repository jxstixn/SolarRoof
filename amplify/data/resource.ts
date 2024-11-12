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
            price: a.integer(),
            images: a.string().array(),
            verified: a.boolean().default(false),
        }
    ).authorization(allow => [
        // allow.owner().to(["create", "update", "delete"]),
        allow.authenticated().to(["read"]),
        allow.guest(),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
    schema,
    authorizationModes: {
        defaultAuthorizationMode: "identityPool",
    },
});