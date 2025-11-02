import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "InnerAnimalMedia - AI-Powered Communication Platform",
  description: "Your unified hub for AI chat, community forums, and video conferencing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster 
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#22252B',
                color: '#FAFAF8',
                border: '1px solid #5F9C9E',
                borderRadius: '12px',
              },
              success: {
                iconTheme: {
                  primary: '#5F9C9E',
                  secondary: '#1A1D23',
                },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}

