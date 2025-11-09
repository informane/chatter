'use client'

import Header from './Header';
import ChatList from './ChatList';
import Messages from './Messages';
import InputMessage from "./InputMessage";
import { useEffect, useState } from 'react';
import './styles.scss';
import { useSearchParams } from 'next/navigation';
import UserSearch from './UserSearch';

export default function Chatter() {
  
  const [chatId, setChatId] = useState(null);
 /* const searchParams = useSearchParams();
  const chat_id = searchParams.get('chat_id') ?? '';*/

  console.log(chatId);
  if (chatId) {

    return (
      <div className='main'>
        <header>
          <Header/>
        </header>
        <section className='chat-window'>
          <aside>            
            <UserSearch/>
            <ChatList chat_id={chatId} onChangeChatId={setChatId}/>
          </aside>
          <article>
            <Messages chat_id={chatId} onChangeChatId={setChatId}/>
            <InputMessage  chat_id={chatId} onChangeChatId={setChatId}/>
          </article>
        </section>
      </div>
    )
  } else {

    return (
      <div className='main'>
        <header>
          <Header/>
        </header>
        <section className='chat-window'>
          <aside>
            <UserSearch/>
            <ChatList chat_id={chatId} onChangeChatId={setChatId}/>
          </aside>
        </section>
      </div>

      
    )
  }
}