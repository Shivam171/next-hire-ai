"use client"
import { Send, FileUser } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useConvex, useMutation } from "convex/react"
import { api } from "../../convex/_generated/api";
import { RecruiterType } from "@/lib/types";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

export default function SendToRecruiter() {
    const convex = useConvex();
    const { id } = useParams();
    const { user } = useUser();
    const [recruiters, setRecruiters] = useState<RecruiterType[]>([]);
    const sendPdf = useMutation(api.recruiters.updateRecruiterInbox);

    // Get recruiter details
    const getRecruiterDetails = useCallback(async () => {
        try {
            const result = await convex.query(api.global.getAllRecruiters, {})
            setRecruiters(result || []);
        } catch (error) {
            console.log("An error occurred while fetching recruiter details:", error);
        }
    }, [convex])

    useEffect(() => {
        getRecruiterDetails();
    }, [getRecruiterDetails]);

    // Get file details from Convex using file id
    const getPDFDetails = useCallback(async () => {
        const idString = id?.toString();
        try {
            const result = await convex.query(api.pdfs.getPdfDetailsByFileId, {
                fileId: idString,
            });
            return {
                fileUrl: result.fileUrl,
                matchedKeywords: result.formattedText?.matchedKeywords
            };
        } catch (error) {
            console.log("An error occurred while fetching PDF details:", error);
        }
    }, [convex, id]);

    const handleSendToRecruiter = async (recruiterId: string) => {
        const pdfUrl = await getPDFDetails();
        const dataToSend = {
            userId: user!.emailAddresses[0].emailAddress,
            userName: user!.fullName,
            userImg: user!.imageUrl,
            resumeUrl: pdfUrl!.fileUrl,
            resumeKeywords: pdfUrl!.matchedKeywords,
        };

        // Saving result?.data to Convex
        await sendPdf({
            userId: recruiterId,
            inbox: {
                message: {
                    resumeUrl: dataToSend.resumeUrl,
                    resumeKeyword: dataToSend.resumeKeywords,
                    userImg: dataToSend.userImg,
                    userName: dataToSend.userName || "",
                },
                sender: dataToSend.userId,
                timestamp: Date.now(),
            }
        });
        toast("Resume sent successfully");
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button type="button" className="px-5 h-9 text-sm">
                    <Send className="w-5 h-5" />
                    Send to Recruiter
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[420px] rounded-md">
                <DialogHeader>
                    <h2 className="text-lg font-semibold flex gap-2 items-center"><FileUser className="w-5 h-5" /> Send your resume to our recruiters</h2>
                    <p className="text-xs text-slate-800">We will get back to you as soon as possible.</p>
                </DialogHeader>
                <DialogDescription>
                    <ScrollArea className={`${(recruiters.length > 0 && (recruiters.length === 1 || recruiters.length === 2)) ? "h-fit" : "h-[400px]"} overflow-y-auto pr-4`}>
                        {/* Recruiter Card */}
                        {recruiters.length > 0 && recruiters.map((recruiter: RecruiterType) => (
                            <div key={recruiter._id} className="flex flex-col gap-2 transition-colors h-full w-full">
                                <div className="flex w-full justify-between border border-gray-300 rounded-md p-4 hover:bg-gray-100/70 hover:shadow-sm">
                                    <div>
                                        {/* Avatar and Name */}
                                        <div className="flex items-center gap-2">
                                            <Image
                                                src={recruiter.profileImage!}
                                                alt="recruiter"
                                                width={25}
                                                height={25}
                                                className="rounded-full object-cover "
                                            />
                                            <h2 className="text-black font-semibold">{recruiter.name}</h2>
                                        </div>
                                        {/* About */}
                                        <div className="flex flex-col text-xs mt-1 line-clamp-1 max-w-sm">
                                            <p className="text-black font-semibold">{recruiter.role}{" "}<span>@{recruiter.company}</span></p>
                                        </div>
                                    </div>
                                    <Button type="button" onClick={() => handleSendToRecruiter(recruiter?.userId)}>
                                        <Send className="w-5 h-5" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                        <div className="flex justify-center items-center h-full w-full">
                            {recruiters.length === 0 && (
                                <div className="flex flex-col gap-2 h-fit justify-center items-center rounded-md p-4">
                                    <Image
                                        src={"/unsure.gif"}
                                        alt="unsure"
                                        width={120}
                                        height={120}
                                        className="object-cover grayscale"
                                        loading="lazy"
                                    />
                                    <h2 className="text-black font-semibold">No recruiters yet!</h2>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </DialogDescription>
            </DialogContent>
        </Dialog>
    )
}
