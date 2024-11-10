import {type ClientSchema, a, defineData} from '@aws-amplify/backend';

const schema = a.schema({
    Listing: a.model({
            name: a.string().required(),
            description: a.string(),
            address: a.string().required(),
            solarScore: a.integer(),
            price: a.integer().required(),
            images: a.string().array(),
        }
    ).authorization(allow => [
        allow.owner().to(["create", "update", "delete"]),
        allow.authenticated().to(["read"]),
        allow.guest().to(["read"]),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
    schema,
    authorizationModes: {
        defaultAuthorizationMode: "userPool",
    },
});