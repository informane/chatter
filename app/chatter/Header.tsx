'use client'

import { useState } from 'react';
import { useSession, signIn, signOut } from "next-auth/react"
import Image from 'next/image';

export default function Header() {

    const [modalSearchIsOpen, setModalSearchIsOpen] = useState(false);
    const {data: session} = useSession();

    function getSessionUserEmail() {
        
        if (session != null) {
            if (session.user != null) {
                if (session.user.email != null) {
                    return session.user.email
                }
            }
        } 
        return false;
    }

    const email = getSessionUserEmail();
    
    if(!email) {
        return (
            <div className='chat-header'>
                <Image src='/logo.png' alt='logo' width={150} height={100}/>
                <h1>Chat with google users!</h1>
                <button className='primary-btn' onClick={() => signIn()}>Sign in</button>
            </div>      
        );
    } else {
        return (
            <div className='chat-header'>
                <Image src='/logo.png' alt='logo' width={150} height={100}/>
                <h1>Chat with google users!</h1>
                <button className='primary-btn' onClick={() => signOut({ callbackUrl: "/api/auth/signin" })}>Sign out({email}) </button>
            </div>      
        );
    }
}