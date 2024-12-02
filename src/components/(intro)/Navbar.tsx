"use client";

import { cn } from "@/lib/utils";
import { ArrowRightIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from 'react';
import Icons from "../global/icons";
import Wrapper from "../global/wrapper";
import { Button } from "@/components/ui/button";
import Menu from "./menu";
import MobileMenu from "@/components/(intro)/mobile-menu";

const Navbar = () => {

    const [isOpen, setIsOpen] = useState<boolean>(false);

    // Disable scrolling when the menu is open
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";

        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    // Close menu on screen resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768 && isOpen) {
                setIsOpen(false); // Close on larger screens
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [isOpen]);

    return (
        <div className="relative w-full h-full">
            <div className="z-[99] fixed pointer-events-none inset-x-0 h-[88px] bg-white backdrop-blur-sm [mask:linear-gradient(to_bottom,#fff_20%,transparent_calc(100%-20%))] select-none"></div>

            <header
                className={cn(
                    "fixed top-4 inset-x-0 mx-auto max-w-6xl px-2 md:px-12 z-[100] transform th",
                    isOpen ? "h-[calc(100%-24px)]" : "h-12"
                )}
            >
                <Wrapper className="backdrop-blur-lg rounded-xl lg:rounded-2xl border border-[rgba(100,100,100,0.2)] px- md:px-2 flex items-center justify-start">
                    <div className="flex items-center justify-between w-full sticky mt-[7px] lg:mt-auto mb-auto inset-x-0">
                        <div className="flex items-center flex-1 lg:flex-none pl-1">
                            <Link href="/" className="text-lg font-semibold text-foreground">
                                <Icons.icon className="w-auto h-5" />
                            </Link>
                            <div className="items-center hidden ml-4 lg:flex">
                                <Menu />
                            </div>
                        </div>
                        <div className="items-center flex gap-2 lg:gap-4">
                            <Button size="sm" variant="outline" asChild className="hover:translate-y-0 hover:scale-100">
                                <Link href="/sign-in">
                                    Login
                                </Link>
                            </Button>
                            <Button size="sm" asChild className="hidden sm:flex">
                                <Link href="/sign-up">
                                    Start for free
                                    <ArrowRightIcon className="w-4 h-4 ml-2 hidden lg:block" />
                                </Link>
                            </Button>
                            {isOpen ? (
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => setIsOpen(false)} // Close menu
                                    className="lg:hidden p-2 w-8 h-8"
                                >
                                    <XIcon className="w-4 h-4 duration-300" />
                                </Button>
                            ) : (
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => setIsOpen(true)} // Open menu
                                    className="lg:hidden p-2 w-8 h-8"
                                >
                                    <Icons.menu className="w-3.5 h-3.5 duration-300" />
                                </Button>
                            )}
                        </div>
                    </div>
                    <MobileMenu isOpen={isOpen} setIsOpen={setIsOpen} />
                </Wrapper>
            </header>

        </div>
    )
};

export default Navbar
