import {Avatar, ScrollShadow} from "@nextui-org/react";
import React from "react";

interface ChatContainerProps {
    user: string,
    latestMessage: string,
    picture?: string
}

function ChatContainer({user, latestMessage, picture}: ChatContainerProps) {
    return (
        <div className={"flex flex-row h-16 w-full bg-transparent hover:bg-default-200 transition-all rounded-3xl gap-4 p-4 items-center hover:cursor-pointer"}>
            <Avatar
                className="transition-transform shadow-md bg-white text-default-500 w-10 h-10 min-w-10 min-h-10"
                showFallback
                isBordered
                src={picture}
            />
            <div className={"flex flex-col w-full"}>
                <span className={"font-bold"}>{user}</span>
                <ScrollShadow orientation="horizontal" className={"text-sm text-gray-500 overflow-hidden whitespace-nowrap max-w-[calc(100%-20px)]"}>{latestMessage}</ScrollShadow>
            </div>
        </div>
    )
}

export default ChatContainer