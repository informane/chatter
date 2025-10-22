'use client';
import Header from './Header';
import ChatList from './ChatList';
import Messages from './Messages';
import InputMessage from "./InputMessage";
import './styles.scss';
import { useSearchParams } from 'next/navigation';
import UserSearch from './UserSearch';
export default function Chatter() {
    var _a;
    var searchParams = useSearchParams();
    var chat_id_str = (_a = searchParams.get('chat_id')) !== null && _a !== void 0 ? _a : '0';
    var chat_id = parseInt(chat_id_str);
    if (chat_id) {
        return (<div>
        <header>
          <Header />
        </header>
        <section className='chat-window'>
          <aside>
            <ChatList chat_id={chat_id}/>
            <UserSearch />
          </aside>
          <article>
            <Messages chat_id={chat_id}/>
            <InputMessage chat_id={chat_id}/>
          </article>
        </section>
      </div>);
    }
    else {
        return (<div>
        <header>
          <Header />
        </header>
        <section className='chat-window'>
          <aside>
            <ChatList chat_id={chat_id}/>
            <UserSearch />
          </aside>
        </section>
      </div>);
    }
}
