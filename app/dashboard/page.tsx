import {cookiesClient, FetchAuthSessionServer} from "@/utils/amplify-utils";
import Preferences from "@/components/dashboard/Preferences";
import Statistics from "@/components/dashboard/Statistics";
import Chats from "@/components/dashboard/Chats";
import Recommendations from "@/components/dashboard/Recommendations";
import {redirect} from "next/navigation";
import InitialSetup from "@/components/dashboard/InitialSetup";
import MyListings from "@/components/dashboard/MyListings";
import MyMatches from "@/components/dashboard/MyMatches";
import Matches from "@/components/dashboard/Matches";

async function Page() {
    const session = await FetchAuthSessionServer()
    const userName = session?.tokens?.idToken?.payload["given_name"] as string
    const userSub = session?.userSub
    const userEmail = session?.tokens?.idToken?.payload["email"] as string

    if (!userName || !userSub || !userEmail) redirect("/login")

    const date = new Date()

    const {data: userData} = await cookiesClient.models.User.get({id: userSub})

    // Get listings for recommendations
    // Do a random query for now
    // Randomize the listing order

    switch (userData) {
        case null:
            return (
                <div className={"flex flex-col w-full items-center h-full max-h-full"}>
                    <InitialSetup sub={userSub} email={userEmail}/>
                </div>
            );
        default:
            return (
                <div className={"flex flex-col w-full items-center h-full max-h-full"}>
                    <div id={"wrapper"}
                         className={"flex flex-col w-full max-w-[1500px] h-full max-h-full px-8 pt-4 gap-8"}>
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
                                Welcome back, {userName}!
                            </h1>
                        </div>
                        <div className={"flex flex-row flex-wrap w-full justify-evenly xl:justify-between gap-4"}>
                            {userData.role === "Investor" &&<Statistics/>}
                            {userData.role === "Lister" && <Matches role={"Lister"}/>}
                            {userData.role === "Investor" && <Preferences preferences={JSON.parse(userData.preferences as string)} userId={userSub}/>}
                            {userData.role === "Lister" && <MyMatches/>}
                            <Chats/>
                        </div>
                        <div className={"flex flex-row w-full gap-4 pb-4 justify-evenly xl:justify-between"}>
                            {userData.role === "Investor" && <Recommendations preferences={JSON.parse(userData.preferences as string)}/>}
                            {userData.role === "Lister" && <MyListings/>}
                        </div>
                    </div>
                </div>
            )
    }
}

export default Page