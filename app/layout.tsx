import { AuthProvider } from './AuthProvider';
import { JSXComponentProps } from './lib/props';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.scss";
import { JSX } from 'react';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Chatter",
  description: "Chat with google users",
};

export default function RootLayout({ children }: JSXComponentProps) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <main>
          <AuthProvider>
              {children}
          </AuthProvider>
        </main>
      </body>
    </html>
  );
}
