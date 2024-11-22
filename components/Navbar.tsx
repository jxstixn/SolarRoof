"use client"
import React, {useEffect, useState} from "react";
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenuToggle,
    NavbarMenu,
    NavbarMenuItem,
    Link as NextLink, Divider, Avatar, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem,
} from "@nextui-org/react";
import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";
import {AuthUser, getCurrentUser, signOut} from "aws-amplify/auth";
import {fetchAuthSession} from "@aws-amplify/core";


export default function Nav() {
    const path = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<AuthUser | undefined>(undefined);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        fetchAuthSession()
            .then((session) => {
                    if (session.tokens?.accessToken !== undefined && session.tokens?.idToken !== undefined) {
                        getCurrentUser().then((user) => setUser(user));
                    }
                }
            );
    }, []);

    return (
        <div className={"flex w-full justify-center"}>
        <Navbar onMenuOpenChange={setIsMenuOpen} isBlurred={false}
                className={"bg-[#ebece7] w-full max-w-[1500px] px-8 lg:py-4"} classNames={{
            wrapper: "max-w-full p-0",
        }}>
            <NavbarContent className={"justify-between"}>
                <NavbarBrand>
                    <Link href={"/"} className="font-bold text-inherit">
                        SolarConnect
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
                    {user ?
                        <Dropdown placement="bottom">
                            <DropdownTrigger>
                                <Avatar
                                    as="button"
                                    className="transition-transform shadow-md bg-white"
                                    showFallback
                                />
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Profile Actions" variant="flat">
                                <DropdownItem key="profile" className="h-14 gap-2">
                                    <p className="font-semibold">Signed in as</p>
                                    <p className="font-semibold">{user?.signInDetails?.loginId}</p>
                                </DropdownItem>
                                <DropdownItem key="dashboard" onPress={() => router.push("/dashboard")}>
                                    Dashboard
                                </DropdownItem>
                                <DropdownItem key="settings">
                                    Settings
                                </DropdownItem>
                                <DropdownItem key="logout" color="danger" onPress={async() => {
                                    await signOut()
                                    setUser(undefined)
                                    router.push("/")
                                }}>
                                    Log Out
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                        : <Link href={"/login"}
                                     className={"rounded-full font-semibold w-20 h-8 bg-zinc-800 hover:bg-white text-white " +
                                         "hover:text-zinc-800 flex items-center justify-center transition-all duration-300 " +
                                         "hover:transform hover:scale-105 text-md shadow-md"}>
                        Login
                    </Link>
                    }
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
                {user ?
                    <NavbarMenuItem key={"Dashboard"} isActive={path === "/dashboard"}>
                        <NextLink href={"/dashboard"} className={"text-black text-xl"}>
                            Dashboard
                        </NextLink>
                    </NavbarMenuItem>
                    : null
                }
                <NavbarMenuItem key={"Login"} className={"justify-end self-end"} isActive={path === "/login"}>
                    {user ?
                        <NextLink className={"text-danger text-xl cursor-pointer"} onPress={
                            async () => {
                                await signOut();
                                setUser(undefined);
                                window.location.reload();
                            }
                        }>Logout</NextLink>
                        : <NextLink href={"/login"} className={"text-black text-xl"}>Login</NextLink>
                    }
                </NavbarMenuItem>

            </NavbarMenu>
        </Navbar>
        </div>
    );
}
