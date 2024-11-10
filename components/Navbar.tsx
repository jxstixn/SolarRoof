"use client"
import React from "react";
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenuToggle,
    NavbarMenu,
    NavbarMenuItem,
    Link as NextLink,
} from "@nextui-org/react";
import Link from "next/link";
import {usePathname} from "next/navigation";

export default function Nav() {
    const path = usePathname();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    return (
        <Navbar onMenuOpenChange={setIsMenuOpen} isBlurred={false}
                className={"bg-[#ebece7] w-full max-w-full px-8 lg:py-4"} classNames={{
            wrapper: "max-w-full p-0",
        }}>
            <NavbarContent className={"justify-between"}>
                <NavbarBrand>
                    <p className="font-bold text-inherit">
                        SolarRoof
                    </p>
                </NavbarBrand>
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    className="lg:hidden"
                />
            </NavbarContent>

            <NavbarContent className={"hidden lg:flex transition-all gap-8 xl:gap-16"} justify="end">
                <NavbarItem className="hidden lg:flex relative group">
                    <Link href={"/"}>
                        Home
                    </Link>
                    <span
                        className={"absolute left-0 bottom-0 w-0 h-[1px] bg-zinc-800 transition-all duration-300 group-hover:w-full" +
                            (path === "/" ? " w-full" : "")}>
                    </span>
                </NavbarItem>
                <NavbarItem className="hidden lg:flex relative group">
                    <Link href={"/marketplace"}>
                        Marketplace
                    </Link>
                    <span
                        className={"absolute left-0 bottom-0 w-0 h-[1px] bg-zinc-800 transition-all duration-300 group-hover:w-full" +
                            (path === "/marketplace" ? " group:w-full" : "")}>
                    </span>
                </NavbarItem>
                <NavbarItem className="hidden lg:flex relative group">
                    <Link href={"/contact"}
                          className={"rounded-full font-semibold w-36 h-12 bg-[#0e4155] hover:bg-[#9efcf1] text-[#9efcf1] " +
                              "hover:text-[#0e4155] flex items-center justify-center transition-all duration-300 " +
                              "hover:transform hover:scale-105 text-lg"}>
                        Apply Now!
                    </Link>
                </NavbarItem>
            </NavbarContent>
            <NavbarMenu className={"bg-[#ebece7] p-8 text-end overflow-hidden"}>
                <NavbarMenuItem key={"Home"}>
                    <NextLink href={"/"} className={"text-black text-xl"}>
                        Home
                    </NextLink>
                </NavbarMenuItem>
                <NavbarMenuItem key={"Marketplace"}>
                    <NextLink href={"/marketplace"} className={"text-black text-xl"}>
                        Marketplace
                    </NextLink>
                </NavbarMenuItem>
            </NavbarMenu>
        </Navbar>
    );
}
