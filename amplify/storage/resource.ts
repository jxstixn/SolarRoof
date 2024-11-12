import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
    name: 'projectDrive',
    access: (allow) => ({
        'listings/*': [
            allow.guest.to(["read", "write"]),
            allow.authenticated.to(["read", "write"]),
        ],
    }),
});