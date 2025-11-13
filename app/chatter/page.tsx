'use client'

import Header from './Header';
import ChatList from './ChatList';
import AgoraMessageWrapper from './AgoraMessageDynamic'
import { useSession, signIn, signOut } from "next-auth/react"
import { Suspense, useEffect, useState } from 'react';
import './styles.scss';
import AgoraMessasgeWrapper from './AgoraMessageDynamic';

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
      setChatList(chats.data);

    }
    initialFetch();

  }, [])

  if (status === 'loading') {
    return <p>Loading session...</p>;
  }

  if (!chatList) {
    return <p>Loading session...</p>;
  }

console.log(chatList)
  const chatWindowsMap = chatList.map((value, index) => {
    return (<AgoraMessasgeWrapper shown={chatId == chatList[index]._id} key={chatList[index]._id} chat_id={chatList[index]._id} onChangeChatId={setChatId} />)
  })


  if (chatId) {

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
  } else {

    return (
      <Suspense fallback={<div>Loading...</div>}>
        <div className='main'>
          <header>
            <Header />
          </header>
          <section className='chat-window'>
            <aside>
              <ChatList chat_id={chatId} onChangeChatId={setChatId} shown={true} />
            </aside>
          </section>
        </div>
      </Suspense>
    )
  }
}