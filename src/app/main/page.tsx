import { UserButton } from '@clerk/nextjs';
import FileUpload from '@/components/FileUpload';
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';

export default function Main() {
    const { userId } = auth()
    const isAuth = !!userId;

    if (!isAuth) {
        redirect('/');
    }

    return (
        <div className='w-screen min-h-screen bg-gray-50'>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="flex flex-col items-center text-center">
                    <div className="flex items-start">
                        <div>
                            <h1 className="text-5xl font-semibold">NxtHireAI</h1>
                            <p className="text-lg">AI powered Applicant Tracking System</p>
                        </div>
                        <div className="mt-2 scale-105">
                            <UserButton
                                afterSignOutUrl="/"
                                appearance={{
                                    elements: {
                                        userButtonAvatarBox: {
                                            width: 30,
                                            height: 30
                                        }
                                    }
                                }}
                            />
                        </div>
                    </div>

                    <p className='mt-4 max-w-xl text-sm text-slate-800'>Transform recruitment with the power of AI, upload CVs and job descriptions to get instant compatibility scores.</p>

                    <div className="w-full mt-4">
                        <FileUpload />
                    </div>
                </div>
            </div>
        </div>
    );
};
