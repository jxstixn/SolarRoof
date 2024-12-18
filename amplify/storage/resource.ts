import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
    name: 'projectDrive',
    access: (allow) => ({
        'listings/*': [
            allow.authenticated.to(["read", "write"]),
            allow.guest.to(["read"]),
        ],
    }),
});