import { FileClock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Items } from "@/lib/types";

interface Props {
    resumeHistory: Items[];
    handleResumeDelete: (fileId: string) => void;
}

export default function ResumeHistory({ resumeHistory, handleResumeDelete }: Props) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button type="button" variant={"outline"} className="px-5 h-9 text-sm">
                    <FileClock className="w-5 h-5" />
                    Resume History
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader className="flex flex-col h-full">
                    <SheetTitle className="flex gap-1 items-center">
                        <FileClock className="w-5 h-5" />
                        Resume History
                    </SheetTitle>
                    <SheetDescription className="flex flex-col text-xs h-full gap-4">
                        <span className="md:text-sm">We value your privacy and keep your resumes secure, We only share information about your resumes to our recruiters and that too only with your consent.<br /><br />If you wish to delete your uploaded resume, you can do it from here.</span>
                        {/* If no resume history show below */}
                        {resumeHistory.length === 0 ? (
                            <div className="grow flex flex-col justify-center items-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                <Image src="/unsure.gif" alt="unsure" height={140} width={140} loading="lazy" className="-ml-6 grayscale object-cover" />
                                <h1 className="mt-2 text-sm text-gray-400">No resume history yet</h1>
                            </div>
                        ) : (
                            <div className="grow flex flex-col gap-2 items-center">
                                <ScrollArea className="w-full max-h-[480px]">
                                    {resumeHistory.map((item: Items, index: number) => (
                                        <div key={index} className="flex flex-col gap-2 mb-2 transition-colors hover:bg-gray-100 border border-gray-300 rounded-lg p-4 mr-4">
                                            <div className="flex justify-between items-center">
                                                <div className="flex flex-col gap-1 sm:text-sm">
                                                    <h1><b>Date :</b>{" "}{formatDate(item.creationTime)}</h1>
                                                    <h1><b>Name :</b>{" "}{item.fileName.replace(".pdf", "")}</h1>
                                                    <div><b>URL :</b>{" "}<Link className="hover:underline" target="_blank" href={item.fileUrl}>{item.fileName}</Link></div>
                                                </div>
                                                <div>
                                                    <Button
                                                        type="button"
                                                        variant={"outline"}
                                                        className="h-9 text-sm w-fit hover:text-red-400 hover:border-red-400 hover:bg-gray-50"
                                                        onClick={() => handleResumeDelete(item.fileId)}
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </ScrollArea>
                            </div>
                        )}
                    </SheetDescription>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    )
}
