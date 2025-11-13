'use client'

import Header from './Header';
import ChatList from './ChatList';
import AgoraMessageWrapper from './AgoraMessageDynamic'
import { useSession, signIn, signOut } from "next-auth/react"
import { Suspense, useEffect, useState } from 'react';
import './styles.scss';
import AgoraMessasgeWrapper from './AgoraMessageDynamic';
import { redirect } from 'next/navigation'

export default function Chatter() {

  const { data: session, status } = useSession();
  const [chatId, setChatId] = useState(null);
  const [chatList, setChatList] = useState([]);
  //              <Messages chat_id={chatId} onChangeChatId={setChatId} />
  //              <InputMessage chat_id={chatId} onChangeChatId={setChatId} />


  useEffect(() => {

    async function initialFetch() {

      const chatsPromise = await fetch('/api/chat/current');
      const chats = await chatsPromise.json();
      if(chats.data.length) setChatList(chats.data);

    }
    if (!chatList.length) initialFetch();

  }, [chatList])

  if (status === 'loading') {
    return <p>Loading session...</p>;
  }
  if(!session) redirect("/api/auth/signin");

  console.log(chatList)
  const chatWindowsMap = chatList.map((value, index) => {
    return (<AgoraMessasgeWrapper shown={chatId == chatList[index]._id} key={chatList[index]._id} chat_id={chatList[index]._id} onChangeChatId={setChatId} />)
  })



  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className='main'>
        <header>
          <Header />
        </header>
        <section className='chat-window'>
          <aside>
            <ChatList chat_id={chatId} onChangeChatId={setChatId} shown={false} />
          </aside>
          {chatWindowsMap}
        </section>
      </div>
    </Suspense>
  )


}