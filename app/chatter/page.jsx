'use client';
import Header from './Header';
import ChatList from './ChatList';
import Messages from './Messages';
import InputMessage from "./InputMessage";
import { Suspense, useState } from 'react';
import './styles.scss';
import UserSearch from './UserSearch';
export default function Chatter() {
    var _a = useState(null), chatId = _a[0], setChatId = _a[1];
    console.log(chatId);
    if (chatId) {
        return (<Suspense fallback={<div>Loading...</div>}>
        <div className='main'>
          <header>
            <Header />
          </header>
          <section className='chat-window'>
            <aside>
              <UserSearch />
              <ChatList chat_id={chatId} onChangeChatId={setChatId}/>
            </aside>
            <article>
              <Messages chat_id={chatId} onChangeChatId={setChatId}/>
              <InputMessage chat_id={chatId} onChangeChatId={setChatId}/>
            </article>
          </section>
        </div>
      </Suspense>);
    }
    else {
        return (<Suspense fallback={<div>Loading...</div>}>
        <div className='main'>
          <header>
            <Header />
          </header>
          <section className='chat-window'>
            <aside>
              <UserSearch />
              <ChatList chat_id={chatId} onChangeChatId={setChatId}/>
            </aside>
          </section>
        </div>
      </Suspense>);
    }
}
