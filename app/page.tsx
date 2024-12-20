import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Home() {
    return (
        <div
            className="flex flex-col w-full h-full max-h-full items-center justify-center text-zinc-800 font-bold text-md overflow-hidden"
        >
            {/* First Image - Slide in from the left */}
            <div
                className="hidden md:block absolute md:-left-[12rem] xl:-left-[3rem] top-1/3 rounded-3xl shadow-xl
               opacity-0 animate-fade-in-left transition-all"
            >
                <Image
                    className="transform transition-transform duration-300 hover:scale-105
                   saturate-50 hover:saturate-100 rounded-3xl"
                    src="/images/dalle1.webp"
                    alt="Solar Roof"
                    width={400}
                    height={400}
                />
            </div>


            {/* Second Image - Slide in from the top */}
            <div
                className="hidden md:block absolute md:left-52 xl:left-1/3 md:-top-[12rem] xl:-top-[8rem] rounded-3xl shadow-xl
               opacity-0 animate-fade-in-down transition-all z-40"
            >
                <Image
                    className="transform transition-transform duration-300 hover:scale-105
                   saturate-50 hover:saturate-100 rounded-3xl"
                    src="/images/dalle2.webp"
                    alt="Solar Roof"
                    width={400}
                    height={400}
                />
            </div>


            {/* Third Image - Slide in from the bottom */}
            <div
                className="hidden md:block absolute md:right-8 xl:right-16 -bottom-[12rem] rounded-3xl shadow-xl
               opacity-0 animate-fade-in-up transition-all"
            >
                <Image
                    className="transform transition-transform duration-300 hover:scale-105
                   saturate-50 hover:saturate-100 rounded-3xl"
                    src="/images/dalle3.webp"
                    alt="Solar Roof"
                    width={400}
                    height={400}
                />
            </div>


            {/* Text Section */}
            <div
                className="flex flex-col items-center justify-center
                   opacity-0 translate-y-10 animate-fade-in-up"
            >
                <h1 className="text-6xl font-extrabold transition-all duration-700 ease-in-out">Less roof,</h1>
                <h1 className="text-6xl font-extrabold transition-all duration-700 ease-in-out">more solar.</h1>
                <p className="text-center text-zinc-600 transition-all duration-700 ease-in-out">
                    Don&apos;t let your roof go to waste.
                    <br/>
                    Rent it out and start earning money today!
                </p>
                <Link href={"/register"}
                      className={"rounded-full font-semibold mt-6 w-36 h-12 bg-[#0e4155] hover:bg-[#9efcf1] text-[#9efcf1] " +
                          "hover:text-[#0e4155] flex items-center justify-center transition-all duration-300 " +
                          "hover:transform hover:scale-105 text-lg shadow-md"}>
                    Get Started!
                </Link>
            </div>
        </div>
    );
}
