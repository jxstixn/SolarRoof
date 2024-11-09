"use client"

import {usePathname} from "next/navigation";
import Link from "next/link";
import Logo from "@/components/icons/Logo";

function Navbar() {
    const path = usePathname();
    console.log(path);

    return (
        <nav className={"flex w-dvw h-[104px] bg-[#ebece7] text-zinc-800 text-lg px-8 py-6 items-center justify-between"}>
            <div className={"flex flex-row text-2xl items-center font-bold italic"}>
                {/*<Logo width={40} height={40}/>*/}
                {/*<span className={"ml-4 text-yellow-500"}>SOLAR</span>*/}
                {/*<span className={"text-[#0e4155]"}>ROOF</span>*/}
            </div>
            <ul className={"flex flex-row items-center gap-16"}>
                <Link href={"/"}>
                    Home
                </Link>
                <Link href={"/about"}>
                    About
                </Link>
                <Link href={"/marketplace"}>
                    Marketplace
                </Link>
                <Link href={"/new"}
                      className={"rounded-full font-semibold w-36 h-14 bg-[#0e4155] hover:bg-[#9efcf1] text-[#9efcf1] " +
                          "hover:text-[#0e4155] flex items-center justify-center transition-all duration-300 " +
                          "hover:transform hover:scale-105"}>
                    Apply Now!
                </Link>
            </ul>
        </nav>
    )
}

export default Navbar;