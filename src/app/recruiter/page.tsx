"use client"
import { UserButton } from '@clerk/nextjs';
import { useConvex } from "convex/react";
import { api } from '../../../convex/_generated/api';
import { Loader2, ExternalLink } from "lucide-react";
import { useAuth } from '@clerk/clerk-react';
import { useRouter } from "next/navigation";
import { useEffect, useCallback, useState } from "react";
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

interface RecruiterType {
    message: {
        resumeKeyword: string[];
        resumeUrl: string;
        userImg: string;
        userName: string;
    };
    sender: string;
    timestamp: number;
}

export default function Recruiter() {
    const convex = useConvex();
    const router = useRouter();
    const { userId } = useAuth();
    const [inbox, setInbox] = useState<RecruiterType[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredInbox, setFilteredInbox] = useState<RecruiterType[]>([]);
    const isAuth = !!userId;

    if (!isAuth) {
        router.push('/');
    }

    useEffect(() => {
        const filtered = inbox.filter((message) => {
            const lowercaseSearchTerm = searchTerm.toLowerCase();
            const keywordMatch = message.message.resumeKeyword.some((keyword) =>
                keyword.toLowerCase().includes(lowercaseSearchTerm)
            );
            return keywordMatch;
        });
        setFilteredInbox(filtered);
    }, [searchTerm, inbox]);

    // Get recruiter details from Convex using user id
    const getRecruiterDetails = useCallback(async () => {
        try {
            const result = await convex.query(api.recruiters.getRecruiterDetails, {
                userId: userId!,
            });
            if (result.message === "Recruiter not found") {
                router.push("/join-as");
                toast("Recruiter not found. Please join as a recruiter first.");
            }
        } catch (error) {
            console.log("An error occurred while fetching recruiter details:", error);
            toast("An error occurred while fetching recruiter details.");
        }
    }, [convex, userId, router]);

    const getRecruiterInbox = useCallback(async () => {
        try {
            const result = await convex.query(api.recruiters.getRecruiterInbox, {
                userId: userId!,
            });
            setInbox(result || []);
        } catch (error) {
            console.log("An error occurred while fetching recruiter inbox:", error);
            toast("An error occurred while fetching recruiter inbox.");
        }
    }, [convex, userId]);

    // Verify user is logged in
    useEffect(() => {
        if (!userId) {
            router.push("/sign-in");
        }
        getRecruiterDetails();
        getRecruiterInbox();
    }, [userId, router, getRecruiterDetails, getRecruiterInbox]);

    return (
        <div className='max-w-screen p-4 h-screen bg-white'>
            <div className="flex flex-col h-full w-full">
                <div className="flex justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold">NxtHireAI</h1>
                        <p className="text-xs">AI powered Applicant Tracking System</p>
                    </div>
                    <div className="mt-2 scale-105">
                        <UserButton
                            afterSignOutUrl="/"
                            appearance={{
                                elements: {
                                    userButtonAvatarBox: {
                                        width: 40,
                                        height: 40
                                    }
                                }
                            }}
                        />
                    </div>
                </div>
                <div className="grow flex flex-col mt-2 gap-4 border-2 border-gray-300 bg-gray-100 border-dashed rounded-xl">
                    {/* Search bar */}
                    <div className="relative">
                        <div className="max-w-xs sm:max-w-lg md:max-w-2xl xl:max-w-3xl mx-auto mt-4">
                            <div className="flex items-center relative">
                                <Input
                                    placeholder="Search by skills..."
                                    className='w-full'
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <div className={`absolute right-0 mr-3 bg-white transition-all ${searchTerm ? 'block' : 'hidden'}`}>
                                    <Loader2 className='animate-spin w-6 h-6 text-gray-400' />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="grow m-4 overflow-hidden">
                        <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(250px,_1fr))] gap-4 h-full">
                            {filteredInbox.length > 0 && filteredInbox.map((message, index) => {
                                return (
                                    <div key={index} className="grid grid-cols-1 md:grid-cols-[repeat(auto-fill,minmax(250px,_1fr))] h-full">
                                        <div className="cursor-default select-none relative flex flex-col gap-2 border border-gray-300 hover:shadow-md transition-all shadow-sm bg-white rounded-lg h-[300px]">
                                            <div className="grow pointer-events-none">
                                                {message?.message?.resumeUrl && (
                                                    <iframe
                                                        src={message?.message?.resumeUrl}
                                                        frameBorder="0"
                                                        className="w-full h-full overflow-hidden px-4 pt-4"
                                                    />
                                                )}
                                            </div>
                                            <div className="flex justify-between px-4 pb-4 items-center select-none">
                                                <div className="flex gap-2 items-center">
                                                    <Image
                                                        src={message?.message?.userImg}
                                                        alt={message?.message?.userName}
                                                        width={30}
                                                        height={30}
                                                        className="rounded-full object-cover shadow-sm"
                                                    />
                                                    <div className="flex flex-col gap-0">
                                                        <div className="text-lg line-clamp-1">{message?.message?.userName}</div>
                                                        <div className="text-xs line-clamp-1 select-text">{message?.sender}</div>
                                                    </div>
                                                </div>
                                                <div onClick={() => window.open(message?.message?.resumeUrl, '_blank')} className="p-4 bg-gray-200 rounded-lg cursor-pointer">
                                                    <ExternalLink className='w-5 h-5 text-gray-800' />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        {inbox.length > 0 && filteredInbox.length === 0 && (
                            <div className="flex flex-col gap-4 items-center justify-center h-full">
                                <Image src="/unsure.gif" alt="no result" priority className='grayscale' width={150} height={150} />
                                <h1 className='text-sm'>No skills matched to your search.</h1>
                            </div>
                        )}
                        {inbox.length === 0 && (
                            <div className="flex flex-col gap-4 items-center justify-center h-full">
                                <Image src="/chill.gif" alt="no resumes shared" priority className='grayscale' width={150} height={150} />
                                <h1 className='text-sm'>No resumes shared with you yet.</h1>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
