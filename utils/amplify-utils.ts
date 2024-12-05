import {cookies} from "next/headers";

import {createServerRunner} from "@aws-amplify/adapter-nextjs";
import {generateServerClientUsingCookies} from "@aws-amplify/adapter-nextjs/api";
import {getCurrentUser} from "aws-amplify/auth/server";
import {getUrl} from "aws-amplify/storage/server";

import {type Schema} from "@/amplify/data/resource";
import outputs from "@/amplify_outputs.json";
import {fetchAuthSession} from "@aws-amplify/core/server";

export const { runWithAmplifyServerContext } = createServerRunner({
    config: outputs,
});

export const cookiesClient = generateServerClientUsingCookies<Schema>({
    config: outputs,
    cookies,
});

export async function AuthGetCurrentUserServer() {
    try {
        return await runWithAmplifyServerContext({
            nextServerContext: {cookies},
            operation: (contextSpec) => getCurrentUser(contextSpec),
        });
    } catch (error) {
        console.error(error);
    }
}

export async function FetchAuthSessionServer() {
    try {
        return await runWithAmplifyServerContext({
            nextServerContext: {cookies},
            operation: (contextSpec) => fetchAuthSession(contextSpec),
        });
    } catch (error) {
        console.error(error);
    }
}

export async function StorageGetUrlServer(path: string) {
    try {
        return await runWithAmplifyServerContext({
            nextServerContext: {cookies},
            operation: (contextSpec) => getUrl(contextSpec, {path: path}),
        });
    } catch (error) {
        console.error(error);
    }
}