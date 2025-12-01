'use client';
import Menu from './Menu';
import Image from 'next/image';
export default function Header() {
    return (<div className='chat-header'>
            <Image src='/logo.png' alt='logo' width={150} height={100}/>
            <h1>Chat with google users!</h1>
            <Menu /*onUpdateChatList={onUpdateChatList}*/ />

        </div>);
}
