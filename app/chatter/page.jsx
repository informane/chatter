'use client';
import Header from './Header';
import ChatList from './ChatList';
import { useSession } from "next-auth/react";
import { Suspense, useEffect, useState } from 'react';
import './styles.scss';
import VoipCallWrapper from './VoipCallDynamic';
import { redirect } from 'next/navigation';
export default function Chatter() {
    const { data: session, status } = useSession();
    const [chatId, setChatId] = useState(null);
    const [newMessageChatId, setNewMessageChatId] = useState(null);
    const [shown, setShown] = useState(false);
    const [chatList, setChatList] = useState([]);
    useEffect(() => {
        async function initialFetch() {
            const chatsPromise = await fetch('/api/chat/current');
            const chats = await chatsPromise.json();
            if (chats.data)
                if (chats.data.length) {
                    setChatList(chats.data);
                    //console.log('page.tsx chatList:', chats.data);
                }
        }
        if (!chatList.length)
            initialFetch();
    }, [chatList]);
    function showNotification(chat_id) {
        setNewMessageChatId(chat_id);
    }
    if (status === 'loading') {
        return <p>Loading session...</p>;
    }
    if (!session)
        redirect("/api/auth/signin");
    //console.log(chatList)
    const chatWindowsMap = chatList.map((value, index) => {
        return (<div className={chatId == chatList[index]._id ? 'right-side' : 'right-side hidden'} key={chatList[index]._id}>
        <VoipCallWrapper userEmail={session.user.email} targetUserEmail={chatList[index].users[0].email}/>
        {/*session.user.email && <AgoraMessasgeWrapper shown={chatId.current == chatList[index]._id} onNewMessage={showNotification} chat_id={chatList[index]._id} onChangeChatId={setChatId} currentUserEmail={session.user.email} targetUserEmail={chatList[index].users[0].email} />*/}
      </div>);
    });
    return (<Suspense fallback={<div>Loading...</div>}>
      <div className='main'>
        <header>
          <Header />
        </header>
        <section className='chat-window'>
          <aside>
            <ChatList chat_id={chatId} onChangeChatId={setChatId} newMessageChatId={newMessageChatId} shown={false}/>
          </aside>
          {chatWindowsMap}
          {/*chatId && <AgoraMessasgeWrapper shown={true} chat_id={chatId} onChangeChatId={setChatId} />*/}
        </section>
      </div>
    </Suspense>);
}
