'use client'

import { useState } from 'react';
import UserSearch from './UserSearch';
import Menu from './Menu'
import { useSession, signIn, signOut } from "next-auth/react"
import Image from 'next/image';

export default function Header() {


    return (
        <div className='chat-header'>
            <Image src='/logo.png' alt='logo' width={150} height={100} />
            <h1>Chat with google users!</h1>
            <Menu/>

        </div>
    );

}