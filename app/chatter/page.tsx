'use client'

import Header from './Header';
import ChatList from './ChatList';
import AgoraMessageWrapper from './AgoraMessageDynamic'
import { useSession, signIn, signOut } from "next-auth/react"
import { Suspense, useEffect, useState, useRef } from 'react';
import './styles.scss';
import AgoraMessasgeWrapper from './AgoraMessageDynamic';
import VoipCallWrapper from './VoipCallDynamic';
import { redirect } from 'next/navigation'
import { getConversationUser, getServerSessionEmail } from "app/lib/chatter";
import OneSignal from 'react-onesignal';

export default function Chatter() {

  const { data: session, status } = useSession();
  const [chatId, setChatId] = useState(null);
  const [newMessageChatId, setNewMessageChatId] = useState(null);
  const [shown, setShown] = useState(false);
  //const [chatList, setChatList] = useState([]);
  const [targetUser, setTargetUser] = useState(null);
  const [myEmail, setMyEmail] = useState(null);

  useEffect(() => {
    // Ensure this code runs only on the client side
    if (typeof window !== 'undefined') {
      OneSignal.init({
        appId: '731a811c-a368-4af1-b5d3-6674c10f47f6',
        safari_web_id: "web.onesignal.auto.597eddd1-7088-4460-8312-f4c61675b8f7",
        /*notifyButton: {
          enable: true,
        },*/
        allowLocalhostAsSecure: true,
      })
    }
  }, []);

  useEffect(() => {

    async function initTargetUser() {
      console.log(chatId, myEmail)
      let target_user;
      setMyEmail(await getServerSessionEmail());

      if (myEmail && chatId) {
        const targetUserPromise = await getConversationUser(chatId, myEmail);
        target_user = await JSON.parse(targetUserPromise);
        setTargetUser(target_user);
      }
    }

    initTargetUser();

    /*async function initialFetch() {

      const chatsPromise = await fetch('/api/chat/current');
      const chats = await chatsPromise.json();
      if (chats.data) if (chats.data.length) {
        setChatList(chats.data);
        //console.log('page.tsx chatList:', chats.data);
      }

    }
    if (!chatList.length) initialFetch();*/

  }, [chatId, myEmail])


  function showNotification(chat_id) {
    setNewMessageChatId(chat_id);
  }

  if (status === 'loading') {
    return <p>Loading session...</p>;
  }
  /*if (!targetUser.email) {
    return <p>Loading session...</p>;
  }*/
  if (!session) redirect("/api/auth/signin");


  //console.log(chatList)
  /*const chatWindowsMap = chatList.map((value, index) => {
     return (
       <div className={chatId == chatList[index]._id ? 'right-side' : 'right-side hidden'} key={chatList[index]._id}>
         <VoipCallWrapper userEmail={session.user.email} targetUserEmail={chatList[index].users[0].email} />
         {session.user.email && <AgoraMessasgeWrapper shown={chatId.current == chatList[index]._id} onNewMessage={showNotification} chat_id={chatList[index]._id} onChangeChatId={setChatId} currentUserEmail={session.user.email} targetUserEmail={chatList[index].users[0].email} />}
       </div>
     )
   })*/

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className='main'>
        <header>
          <Header />
        </header>
        <section className='chat-window'>
          <aside>
            <ChatList chat_id={chatId} onChangeChatId={setChatId} newMessageChatId={newMessageChatId} shown={false} />
          </aside>
          {/*chatWindowsMap*/}
          <div className='right-side'>
            {chatId && targetUser && <VoipCallWrapper userEmail={session.user.email} targetUserEmail={targetUser.email} />}
            {/*session.user.email && <AgoraMessasgeWrapper shown={chatId.current == chatList[index]._id} onNewMessage={showNotification} chat_id={chatList[index]._id} onChangeChatId={setChatId} currentUserEmail={session.user.email} targetUserEmail={chatList[index].users[0].email} />*/}
          </div>
          {/*chatId && <AgoraMessasgeWrapper shown={true} chat_id={chatId} onChangeChatId={setChatId} />*/}
        </section>
      </div>
    </Suspense>
  )


}