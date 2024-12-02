"use client"
import { useConvex, useMutation } from 'convex/react'
import React, { useState, useEffect } from 'react'
import { useRouter } from "next/navigation"
import { Button } from '@/components/ui/button'
import { BriefcaseBusiness, TextSearch, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input';
import { Image as Img } from 'lucide-react'
import Image from 'next/image'
import { toast } from "sonner";
import { getAvatarUrls } from '@/lib/getUrlFromFirebase'
import { api } from '../../../convex/_generated/api'
import { useAuth } from '@clerk/clerk-react';

export default function JoinAs() {
    const { userId } = useAuth();
    const convex = useConvex();
    const router = useRouter();
    const [isRecruiter, setIsRecruiter] = useState<boolean>(false);
    const [isRecruiterSelected, setIsRecruiterSelected] = useState<boolean>(false);
    const [selectedImage, setSelectedImage] = React.useState("");
    const [images, setImages] = useState<string[]>([]);
    const createRecruiter = useMutation(api.recruiters.addRecruiter);
    const [isDualRole, setIsDualRole] = useState<boolean>(false);
    const [isAlreadyRecruiter, setIsAlreadyRecruiter] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const checkUser = async () => {
            setLoading(true);
            try {
                const { existsInRecruiters, existsInPdfs } = await convex.query(api.global.checkUserInCollections, { userId: userId! });
                if (existsInRecruiters && existsInPdfs) {
                    // console.log("User exists as both recruiter and jobseeker");
                    setLoading(false);
                    setIsDualRole(true); // Enable dual-role selection
                } else if (existsInRecruiters) {
                    // console.log("User exists as recruiter");
                    setLoading(false);
                    setIsAlreadyRecruiter(true); // recruiter-specific options
                } else if (existsInPdfs) {
                    // console.log("User exists as jobseeker");
                    setLoading(false);
                }
                if (!existsInRecruiters && !existsInPdfs) {
                    // If user doesn't exist in both collections, then ask user to join as either recruiter or jobseeker
                    // console.log("User doesn't exist in both collections");
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error checking user in collections:", error);
            }
        };
        checkUser();
    }, [convex, userId]);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const urls = await getAvatarUrls();
                setImages(urls);
            } catch (error) {
                console.error("Error fetching images:", error);
            }
        };
        fetchImages();
    }, []);

    const handleImageSelect = (imageSrc: string) => {
        setSelectedImage(prev => (prev === imageSrc ? "" : imageSrc));
    };

    const handleRecruiterSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const company = formData.get('company') as string;
        const role = formData.get('role') as string;

        // Validate the form data
        if (!name || !email || !company || !role || !selectedImage) {
            toast('Please fill in all fields.');
            return;
        }

        // Validate email
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            toast('Invalid email address.');
            return;
        }

        // Save the recruiter details to Convex
        try {
            const result = await createRecruiter({
                userId: userId!,
                role: "recruiter",
                recruiterDetails: {
                    name,
                    email,
                    role,
                    company,
                    profileImage: selectedImage,
                },
            })
            if (result.success) {
                toast("Details saved successfully!");
                router.push('/recruiter');
            } else {
                toast("Failed to save details. Please try again.");
            }
        } catch (error) {
            console.error("Error saving recruiter details:", error);
        }
    }

    if (isDualRole) {
        return (
            <div className="w-screen min-h-screen bg-gray-50">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="text-gray-800 flex flex-col gap-4 items-center select-none">
                        <span className='text-4xl font-semibold text-center'>Join as</span>
                        <p className='text-center text-xs'>You have already signed up as both recruiter and jobseeker, Choose one.</p>
                        <div className="flex gap-4">
                            <div className="flex flex-col items-center p-4 gap-4 hover:bg-gray-200/60 rounded-lg">
                                <div className="p-4 bg-gray-50 border-2 border-dashed border-black rounded-lg">
                                    <BriefcaseBusiness className='w-7 h-7' />
                                </div>
                                <Button type='button' onClick={() => router.push('/recruiter')}>Recruiter</Button>
                            </div>
                            <div className="flex flex-col items-center p-4 gap-4 hover:bg-gray-200/60 rounded-lg">
                                <div className="p-4 bg-gray-50 border-2 border-dashed border-black rounded-lg">
                                    <TextSearch className='w-7 h-7' />
                                </div>
                                <Button type='button' onClick={() => router.push('/main')}>Job Seeker</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (isAlreadyRecruiter) {
        return (
            <div className="w-screen min-h-screen bg-gray-50">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="text-gray-800 flex flex-col gap-4 items-center select-none">
                        <span className='text-4xl font-semibold text-center'>Join as</span>
                        <p className='text-center text-xs'>You have already signed up as recruiter. Continue as recruiter or Would you like to join as a jobseeker as well?</p>
                        <div className="flex gap-4">
                            <div className="flex flex-col items-center p-4 gap-4 hover:bg-gray-200/60 rounded-lg">
                                <div className="p-4 bg-gray-50 border-2 border-dashed border-black rounded-lg">
                                    <BriefcaseBusiness className='w-7 h-7' />
                                </div>
                                <Button type='button' onClick={() => router.push('/recruiter')}>Recruiter</Button>
                            </div>
                            <div className="flex flex-col items-center p-4 gap-4 hover:bg-gray-200/60 rounded-lg">
                                <div className="p-4 bg-gray-50 border-2 border-dashed border-black rounded-lg">
                                    <TextSearch className='w-7 h-7' />
                                </div>
                                <Button type='button' onClick={() => router.push('/main')}>Job Seeker</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="w-screen min-h-screen bg-gray-50">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="text-gray-800 p-10 border-2 border-dashed border-gray-400 bg-gray-200 rounded-lg flex flex-col gap-4 items-center select-none">
                        <div className="">
                            <Image src="/chill.gif" width={150} height={150} alt="Chill GIF" loading='lazy' className='grayscale' />
                        </div>
                        <div className="flex gap-2 items-center text-sm">
                            <Loader2 className='animate-spin w-5 h-5' />
                            <span className='font-semibold text-center'>Loading...</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="w-screen min-h-screen bg-gray-50">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="text-gray-800 flex flex-col gap-4 items-center select-none">
                    {isRecruiter ? (
                        // If recruiter
                        <>
                            <span className='text-2xl sm:text-4xl font-semibold text-center'>
                                {isRecruiterSelected ? 'Enter your details' : 'Join as a Recruiter'}
                            </span>
                            <div className="flex flex-col gap-4 w-[400px]">
                                {isRecruiterSelected ? (
                                    <form onSubmit={handleRecruiterSubmit} className="flex flex-col gap-4">
                                        <p className='text-center'>Don&apos;t worry, we only need a few details from you</p>
                                        <div className="">
                                            <label className='text-xs font-medium'>Full Name *</label>
                                            <Input type="text" name='name' placeholder='Enter your name' />
                                        </div>
                                        <div className="">
                                            <label className='text-xs font-medium'>Email *</label>
                                            <Input type="text" name='email' placeholder='Enter your name' />
                                        </div>
                                        <div className="">
                                            <label className='text-xs font-medium'>Role *</label>
                                            <Input type="text" name='role' placeholder='Enter your position' />
                                        </div>
                                        <div className="">
                                            <label className='text-xs font-medium'>Company *</label>
                                            <Input type="text" name='company' placeholder='Enter your name' />
                                        </div>
                                        <div className="flex justify-between">
                                            <Button type='button' onClick={() => setIsRecruiterSelected(false)}>Go Back</Button>
                                            <Button type='submit'>Lets Go</Button>
                                        </div>
                                        <p className="text-sm text-center">Page <b>2</b> of <b>2</b></p>
                                    </form>
                                ) : (
                                    <div className="flex flex-col items-center gap-4">
                                        {/* Profile Picture when no image is selected */}
                                        {selectedImage ? (
                                            <div className="w-20 h-20 bg-gray-100 rounded-full flex justify-center items-center border-2 border-dashed border-gray-400">
                                                <Image
                                                    src={selectedImage}
                                                    alt='selectedImage'
                                                    loading='lazy'
                                                    width={40} height={40}
                                                    className="rounded-full object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-20 h-20 bg-gray-100 rounded-full flex justify-center items-center border-2 border-dashed border-gray-400">
                                                <Img className='w-7 h-7 text-gray-500' />
                                            </div>
                                        )}
                                        <label className='text-xs font-medium'>Choose a profile picture from below</label>
                                        <div className="flex gap-3 flex-wrap w-[300px]">
                                            {images.map((url, index) => (
                                                <div key={index} onClick={() => handleImageSelect(url)} className="w-12 h-12 cursor-pointer bg-gray-200 rounded-full flex justify-center items-center shadow-sm hover:border-2 hover:border-gray-500">
                                                    <Image
                                                        key={index}
                                                        src={url}
                                                        alt={`Avatar ${index}`}
                                                        loading='lazy'
                                                        width={30} height={30}
                                                        className="rounded-full object-cover"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex justify-between w-[300px]">
                                            <Button type='button' onClick={() => { setIsRecruiter(false); setSelectedImage('') }}>Go Back</Button>
                                            <Button type='button' disabled={!selectedImage} onClick={() => setIsRecruiterSelected(true)}>Continue</Button>
                                        </div>
                                        <p className="text-sm text-center">Page <b>1</b> of <b>2</b></p>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        // If not recruiter
                        <>
                            <span className='text-4xl font-semibold text-center'>Join as</span>
                            <div className="flex gap-4">
                                <div className="flex flex-col items-center p-4 gap-4 hover:bg-gray-200/60 rounded-lg">
                                    <div className="p-4 bg-gray-50 border-2 border-dashed border-black rounded-lg">
                                        <BriefcaseBusiness className='w-7 h-7' />
                                    </div>
                                    <Button type='button' onClick={() => setIsRecruiter(true)}>Recruiter</Button>
                                </div>
                                <div className="flex flex-col items-center p-4 gap-4 hover:bg-gray-200/60 rounded-lg">
                                    <div className="p-4 bg-gray-50 border-2 border-dashed border-black rounded-lg">
                                        <TextSearch className='w-7 h-7' />
                                    </div>
                                    <Button type='button' onClick={() => router.push('/main')}>Job Seeker</Button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
