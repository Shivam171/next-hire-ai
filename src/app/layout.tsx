import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

import { Toaster } from "@/components/ui/sonner"
import {
  ClerkProvider,
} from '@clerk/nextjs';
import { ConvexClientProvider } from "./ConvexClientProvider";
import { QuizProvider } from "@/components/QuizProvider";

export const metadata: Metadata = {
  title: "NextHireAI",
  description: "NextHireAI - Smart ATS Automation powered by AI and great features.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={GeistSans.className}
      >
        <ClerkProvider>
          <ConvexClientProvider>
            <QuizProvider>{children}</QuizProvider>
          </ConvexClientProvider>
        </ClerkProvider >
        <Toaster />
      </body>
    </html>
  );
}
