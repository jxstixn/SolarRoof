import {FetchAuthSessionServer} from "@/utils/amplify-utils";
import Preferences from "@/components/dashboard/Preferences";
import Statistics from "@/components/dashboard/Statistics";
import Chats from "@/components/dashboard/Chats";

async function Page() {
    const session = await FetchAuthSessionServer()
    const user = session?.tokens?.idToken?.payload["given_name"]
    const date = new Date()

    return (
        <div className={"flex flex-col w-full items-center h-full max-h-full"}>
            <div id={"wrapper"}
                 className={"flex flex-col w-full max-w-[1500px] h-full max-h-full px-8 py-4 gap-8"}>
                <div id={"greetings"} className={"flex flex-col"}>
                    <p className={"text-lg text-gray-500 font-semibold animate-fade-in-up"}>
                        {date.toLocaleDateString("en-US", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric"
                        })}
                    </p>
                    <h1 className={"text-4xl text-zinc-800 font-semibold animate-fade-in-up"}>
                        Welcome back, {user as string}!
                    </h1>
                </div>
                <div className={"flex flex-row flex-wrap w-full justify-evenly xl:justify-between gap-4 pb-8"}>
                    <Statistics/>
                    <Preferences/>
                    <Chats/>
                </div>
            </div>
        </div>
    )
}

export default Page