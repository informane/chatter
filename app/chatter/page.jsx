'use client';
import Header from './Header';
import ChatList from './ChatList';
import Messages from './Messages';
import InputMessage from "./InputMessage";
import { useState } from 'react';
import './styles.scss';
import UserSearch from './UserSearch';
export default function Chatter() {
    var _a = useState(null), chatId = _a[0], setChatId = _a[1];
    /* const searchParams = useSearchParams();
     const chat_id = searchParams.get('chat_id') ?? '';*/
    function changeChatId(chat_id) {
        setChatId(chat_id);
    }
    if (chatId) {
        return (<div className='main'>
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
      </div>);
    }
    else {
        return (<div className='main'>
        <header>
          <Header />
        </header>
        <section className='chat-window'>
          <aside>
            <UserSearch />
            <ChatList chat_id={chatId} onChangeChatId={setChatId}/>
          </aside>
        </section>
      </div>);
    }
}
