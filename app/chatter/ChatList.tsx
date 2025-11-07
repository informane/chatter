'use client'

import { ChatterProps } from 'app/lib/props';
import { useSession } from "next-auth/react";
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useActionState, useState, useEffect } from 'react';
import Search from './Search';

function ChatList({ chat_id, onChangeChatId }: ChatterProps) {
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
            console.log(chats)
            if (!chats.success) {
                setError({ message: chats.error });
                setChats([]);

            } else {
                setChats(chats.data);
                setError({ message: null });

            }
            setError({ message: null });
        }

        initialFetch(term);

        /*const eventSource = new EventSource('/api/chat/current/update');

        eventSource.onmessage = (event) => {
            setChats(event.data.chats);
        }

        eventSource.onerror = (error) => {
            console.log(error);
            eventSource.close()
        }

        return () => {
            eventSource.close();
        };*/

    }, [term]);


    if (status === 'loading') {
        return <p>Loading session...</p>;
    }

    function chooseChat(new_chat_id: string) {
        chat_id = new_chat_id;
        onChangeChatId(chat_id);
    }

    function renderChatList() {
        if (!Chats.length)
            return (
                <div className='chat-not-found'>
                    Contacts not found!
                </div>
            );

        const chatList = Chats.map((value, index) => {
            return (
                <div key={Chats[index]._id} className={Chats[index]._id === chat_id ? 'chat chosen' : 'chat'} onClick={(e) => chooseChat(Chats[index]._id)}>
                    <img src={Chats[index].users[0].avatar} height={35} width={35}/>
                    <span>{Chats[index].users[0].name}</span>
                </div>
            )
        })

        return chatList;
    }



    return (
        <div className='chats'>
            <div className='chat-search'>
                <Search queryVar='chat-search' placeholder='search your contacts' onTermChange={setTerm} />
            </div>
            <div className='chat-list'>
                {renderChatList()}
            </div>
        </div>
    )
}

export default ChatList;