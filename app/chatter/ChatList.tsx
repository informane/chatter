'use client'

import { ChatterProps } from 'app/lib/props';
import { useSession } from "next-auth/react";
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useActionState, useState, useEffect, useRef } from 'react';
import Search from './Search';
import { IChatDocument } from './models/Chat';
import { getUserModel, getUserModelJson } from '../lib/chatter';
import { Model } from 'mongoose';
import Image from 'next/image';
import UserSearch from './UserSearch';

function ChatList({newMessageChatId, chat_id, onChangeChatId, shown }: ChatterProps) {
    //if chatlist is shown
    const [isShown, setIsShown] = useState(shown);
    const [chatId, setChatId] = useState(chat_id);
    const [NewMessageChatId, setNewMessageChatId] = useState(null);
    const [chatListChanged, setChatListChanged] = useState(true);
    const [userId, setUserId] = useState(null);
    const eventSourceRef = useRef<EventSource | null>(null);
    const { data: session, status } = useSession();
    const [Chats, setChats] = useState([]);
    //const [state, formAction, isPending] = useActionState(addChat, {});
    const searchParams = useSearchParams();
    const [term, setTerm] = useState(searchParams.get('chat-search') ?? '');
    const [error, setError] = useState({ message: null });


    useEffect(() => {

        async function initialFetch(term: string) {

            const chatsPromise = await fetch('/api/chat/current?query=' + term);
            const chats = await chatsPromise.json();
            console.log('chats:', chats)
            if (!chats.success) {
                setError({ message: chats.error });
                setChats([]);

            } else {
                setChats(chats.data);
                setError({ message: null });

            }
            setError({ message: null });
        }
        if (chatListChanged || NewMessageChatId) {
            setNewMessageChatId(null);
            initialFetch(term);
            setChatListChanged(false);

        }

        async function setUserIdAsync() {
            if (session?.user?.email && !userId) {
                const userJson = await getUserModelJson(session?.user?.email);
                const user = JSON.parse(userJson);
                setUserId(user._id);
            }
        }
        setUserIdAsync();

        /*if (eventSourceRef.current || !userId) return;

        const eventSource = new EventSource('/api/chat/current/update?user_id=' + userId);
        eventSourceRef.current = eventSource;
        console.log('ES:', eventSource);

        eventSourceRef.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('data:', data);
            //const chats: Model<IChatDocument> = data;

            setChats(prevChats=>[...prevChats, data]);
        }

        eventSourceRef.current.onerror = (error) => {
            console.log(JSON.stringify(error));
            eventSourceRef.current.close()
        }

        return () => {
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
                eventSourceRef.current = null;
                console.log('Closing EventSource connection');
            }
        };*/

    }, [userId, chatListChanged]);

    function updateChatList(state) {
        setChatListChanged(state);
    }

    if (status === 'loading') {
        return <p>Loading session...</p>;
    }

    function chooseChat(new_chat_id: string) {
        setIsShown(false);
        setChatId(new_chat_id);
        onChangeChatId(new_chat_id);
    }

    function renderChatList() {
        if (!Chats.length)
            return (
                <>
                    <div className='chat-not-found'>
                        Contacts not found!
                    </div>
                    <UserSearch onUpdateChatList={updateChatList} />
                </>
            );
        //<VoipCall userEmail={session.user.email} targetUserEmail={Chats[index].users[0].email} />
        const chatList = Chats.map((value, index) => {
            return (
                <div key={Chats[index]._id} className={Chats[index]._id === chatId ? 'chat chosen' : 'chat'} onClick={(e) => chooseChat(Chats[index]._id)}>
                    <div className='notification'>
                        {Chats[index].unreadCount ? Chats[index].unreadCount : 0}
                    </div>
                    <Image src={Chats[index].users[0].avatar} height={35} width={35} alt={Chats[index].users[0].name} />
                    <span>{Chats[index].users[0].name}</span>

                </div>
            )
        })

        return chatList;
    }
    /*const notifyList = Chats.map((value, index) => {
        <div className='notifications'>
            
        </div>

        return notifyList;
    }*/
    return (
        <div className='chat-aside'>
            <div className={!isShown ? 'aside-show-btn' : 'aside-show-btn hidden'} onClick={(e) => (setIsShown(true))}>🡂</div>
            <div className={isShown ? 'aside-hide-btn' : 'aside-hide-btn hidden'} onClick={(e) => (setIsShown(false))}>🡀</div>
            <div className={isShown ? 'chat-aside-inner' : 'chat-aside-inner hidden'}>
                <UserSearch onUpdateChatList={updateChatList} />
                <div className='chat-search'>
                    <Search queryVar='chat-search' placeholder='search your contacts' onTermChange={setTerm} />
                </div>
                <div className='chat-list'>
                    {renderChatList()}
                </div>
            </div>
        </div>
    )
}

export default ChatList;