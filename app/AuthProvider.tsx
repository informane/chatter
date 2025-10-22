'use client'
import React from 'react';
import { JSXComponentProps } from './lib/props';
import { SessionProvider } from "next-auth/react"

export const AuthProvider: React.FC<JSXComponentProps> = ({children}) => {
    return (
        <SessionProvider>{children}</SessionProvider>
    )
};