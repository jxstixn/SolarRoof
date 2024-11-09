"use client"

import {usePathname} from "next/navigation";
import Link from "next/link";
import Logo from "@/components/icons/Logo";

function Navbar() {
    const path = usePathname();
    console.log(path);

    return (
        <nav
            className={"flex w-full h-[104px] bg-[#ebece7] text-zinc-800 text-lg px-8 py-6 items-center justify-between"}>
            <div className={"flex flex-row text-2xl items-center font-bold italic"}>
                {/*<Logo width={40} height={40}/>*/}
                {/*<span className={"ml-4 text-yellow-500"}>SOLAR</span>*/}
                {/*<span className={"text-[#0e4155]"}>ROOF</span>*/}
            </div>
            <ul className={"flex flex-row items-center gap-16"}>
                <div className={"relative group"}>
                    <Link href={"/"}>
                        Home
                    </Link>
                    <span
                        className="absolute left-0 bottom-0 w-0 h-[1px] bg-zinc-800 transition-all duration-300 group-hover:w-full"></span>
                </div>
                <div className={"relative group"}>

                    <Link href={"/marketplace"}>
                        Marketplace
                    </Link>
                    <span
                        className="absolute left-0 bottom-0 w-0 h-[1px] bg-zinc-800 transition-all duration-300 group-hover:w-full"></span>
                </div>
                <Link href={"/contact"}
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