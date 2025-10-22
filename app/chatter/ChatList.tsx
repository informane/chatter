'use client'

import { addChatAction } from '../lib/chatter';
import { ChatterProps } from 'app/lib/props';
import { useSession } from "next-auth/react";
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useActionState, useState, useEffect } from 'react';
import Search from './Search';


function ChatList({ chat_id }: ChatterProps) {
    const { data: session, status } = useSession();
    const [chatFormState, setChatFormState] = useState({ name: '', description: '', error: '' });
    const [Chats, setChats] = useState([{ _id: 0, name: '', description: '', error: '' }]);
    //const [state, formAction, isPending] = useActionState(addChat, {});


    useEffect(() => {

        async function initialFetch() {
            const chatsPromise = await fetch('/api/chat/current');
            const chats = await chatsPromise.json();
            if (!chats.error) {
                setChats(chats.data);
            } else {
                return <p>Server error loading chats!</p>
            }
        }

        initialFetch();

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

    }, []);


    if (status === 'loading') {
        return <p>Loading session...</p>;
    }

    function renderChatList() {
        if (!Chats.length) return <p>You dont have chats yet!</p>

        const chatList = Chats.map((value, index) => {
            return (
                <div key={Chats[index]._id} className='chat'>
                    <div className='chat-name'>{Chats[index].name}</div>
                </div>
            )
        })

        return chatList;
    }

    function actionHandler(formData: FormData){
        
        const addedChat = addChatAction(formData);
    }

    return (
        <div className='chats'>
            <form className='chat-form' action={actionHandler}>
                <h2>Add Chat</h2>
                <input type="text" name="name" value={chatFormState.name} onChange={(e) => setChatFormState({ ...chatFormState, name: e.target.value })} />
                <input type="text" name="description" value={chatFormState.description} onChange={(e) => setChatFormState({ ...chatFormState, description: e.target.value })} />
                <button type="submit">Add Chat</button>
                {chatFormState.error}
            </form>
            <div className='chat-list'>
                {renderChatList()}
            </div>
        </div>
    )
}

export default ChatList;