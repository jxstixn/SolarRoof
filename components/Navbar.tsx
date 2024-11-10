"use client"
import React, {useState} from "react";
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenuToggle,
    NavbarMenu,
    NavbarMenuItem,
    Link as NextLink, Divider,
} from "@nextui-org/react";
import Link from "next/link";
import {usePathname} from "next/navigation";

export default function Nav() {
    const path = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <Navbar onMenuOpenChange={setIsMenuOpen} isBlurred={false}
                className={"bg-[#ebece7] w-full max-w-full px-8 lg:py-4"} classNames={{
            wrapper: "max-w-full p-0",
        }}>
            <NavbarContent className={"justify-between"}>
                <NavbarBrand>
                    <Link href={"/"} className="font-bold text-inherit">
                        SolarRoof
                    </Link>
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
                            (path === "/marketplace" ? " w-full" : "")}>
                    </span>
                </NavbarItem>
                <NavbarItem className="hidden lg:flex relative group">
                    <Link href={"/contact"}>
                        Contact
                    </Link>
                    <span
                        className={"absolute left-0 bottom-0 w-0 h-[1px] bg-zinc-800 transition-all duration-300 group-hover:w-full" +
                            (path === "/contact" ? " w-full" : "")}>
                    </span>
                </NavbarItem>
                <NavbarItem className="hidden lg:flex relative group">
                    <Link href={"/login"}
                          className={"rounded-full font-semibold w-20 h-8 bg-zinc-800 hover:bg-white text-white " +
                              "hover:text-zinc-800 flex items-center justify-center transition-all duration-300 " +
                              "hover:transform hover:scale-105 text-md shadow-md"}>
                        Login
                    </Link>
                </NavbarItem>
            </NavbarContent>
            <NavbarMenu className={"flex flex-col h-full bg-[#ebece7] p-8 text-end overflow-hidden z-50"}>
                <NavbarMenuItem key={"Home"} isActive={path === "/"}>
                    <NextLink href={"/"} className={"text-black text-xl"}>
                        Home
                    </NextLink>
                </NavbarMenuItem>
                <NavbarMenuItem key={"Marketplace"} isActive={path === "/marketplace"}>
                    <NextLink href={"/marketplace"} className={"text-black text-xl"}>
                        Marketplace
                    </NextLink>
                </NavbarMenuItem>
                <NavbarMenuItem key={"Contact"} isActive={path === "/contact"}>
                    <NextLink href={"/contact"} className={"text-black text-xl"}>
                        Contact
                    </NextLink>
                </NavbarMenuItem>
                <Divider className={"bg-transparent p-2"}/>
                <NavbarMenuItem key={"Login"} className={"justify-end self-end"} isActive={path === "/login"}>
                    <NextLink href={"/login"} className={"text-black text-xl"}>
                        Login
                    </NextLink>
                </NavbarMenuItem>

            </NavbarMenu>
        </Navbar>
    );
}
