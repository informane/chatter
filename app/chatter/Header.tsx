'use client'

import { useActionState, useContext } from 'react';
import { useSession, signIn, signOut } from "next-auth/react"
import Image  from "next/image"
export default function Header() {

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
                <img src='./logo.png' alt='logo' width={150} height={100}/>
                <h1>Chatter</h1>
                <button onClick={() => signIn()}>Sign in</button>
            </div>      
        );
    } else {
        return (
            <div className='chat-header'>
                <img src='./logo.png' alt='logo' width={150} height={100}/>
                <h1>Chatter</h1>
                <button onClick={() => signOut({ callbackUrl: "/api/auth/signin" })}>Sign out({email}) </button>
            </div>      
        );
    }
}