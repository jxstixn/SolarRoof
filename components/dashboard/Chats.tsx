"use client"
import React from "react";
import ChatContainer from "@/components/dashboard/ChatContainer";
import {ScrollShadow} from "@nextui-org/react";

const dummyChats = [
    {
        user: "John Doe",
        latestMessage: "Hello, how are you?",
        picture: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
        user: "Kevin Smith",
        latestMessage: "How much for the roof?",
        picture: "https://randomuser.me/api/portraits/men/67.jpg"
    },
    {
        user: "Jane Doe",
        latestMessage: "I'm interested in your services",
        picture: "https://randomuser.me/api/portraits/women/37.jpg"
    },
    {
        user: "Tommy Smith",
        latestMessage: "Can I get a quote?",
        picture: "https://randomuser.me/api/portraits/men/2.jpg"
    },
    {
        user: "Sally Doe",
        latestMessage: "Is this an open space or rather roof space?",
        picture: "https://randomuser.me/api/portraits/women/99.jpg"
    },
    {
        user: "John Doe",
        latestMessage: "Hello, how are you?",
        picture: "https://randomuser.me/api/portraits/men/14.jpg"
    }
]

function Chats() {
    return (
        <div
            className={"flex flex-col bg-white w-full max-w-96 min-w-[300px] h-[420px] max-h-[420px] rounded-3xl p-4 gap-2 animate-fade-in-up shadow-md"}>
            <h1 className={"text-xl font-bold"}>Chats</h1>
            <ScrollShadow className={"flex flex-col h-full w-full gap-2 overflow-x-hidden shadow-none"}>
                {dummyChats.map((chat, index) => (
                    <ChatContainer key={index} user={chat.user} latestMessage={chat.latestMessage} picture={chat.picture}/>
                ))}
            </ScrollShadow>
        </div>
    )
}

export default Chats