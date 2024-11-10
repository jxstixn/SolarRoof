import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import {NextUIProvider} from "@nextui-org/react";

const inter = Inter({
    subsets: ['latin'], // Optionally add other subsets like 'latin-ext' or 'cyrillic'
});

export const metadata: Metadata = {
    title: "SolarRoof",
    description: "SolarRoof is a roof rental service that allows you to rent solar panels for your home.",
};

import ConfigureAmplifyClientSide from "@/components/ConfigureAmplify";

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={"bg-[#ebece7]"}>
        <body
            className={`${inter.className} antialiased bg-[#ebece7] text-black`}
        >
        <ConfigureAmplifyClientSide/>
        <NextUIProvider>
            <Navbar/>
            <main className={"max-w-dvw max-h-[calc(100dvh-7rem)] w-full h-dvh"}>
                {children}
            </main>
        </NextUIProvider>
        </body>
        </html>
    );
}
