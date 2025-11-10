'use client'

import { useState, useEffect } from 'react';

import { ChatterProps } from '../lib/props';
import { getConversationUser } from '../lib/chatter';
import { IMessageDocument } from './models/Message';
import { IUserDocument } from './models/User';
import { useSession } from "next-auth/react";
import type { Session, User } from '@auth/core/types';
import { useRouter } from 'next/navigation';
import { Model } from "mongoose";
import { useRef } from 'react';
import VoipCallDynamic from './VoipCallDynamic';

function Messages({ chat_id }: ChatterProps) {

    const [messages, setMessages] = useState([]);
    const [convUser, setConvUser] = useState(null);
    const eventSourceRef = useRef<EventSource | null>(null);
    const { data: session, status } = useSession();
    //const [state, formAction, isPending] = useActionState(fn, initialState, permalink?);

    useEffect(() => {

        async function initialFetch(chat_id: string) {
            const msgPromise = await fetch('/api/message/current?chat_id=' + chat_id);
            const msgs = await msgPromise.json();
            setMessages(msgs.data);
            //console.log(messages, msgs.data);


        }

        initialFetch(chat_id);

        if (eventSourceRef.current) return;

        const eventSource = new EventSource('/api/message/current/update?chat_id=' + chat_id);
        eventSourceRef.current = eventSource;

        eventSourceRef.current.onmessage = (event) => {

            const data = JSON.parse(event.data);
            const addedMessage: Model<IMessageDocument> = data;

            setMessages(prevMessages => [...prevMessages, addedMessage]);
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
        };

    }, [chat_id]);

    const router = useRouter();
    useEffect(() => {

        if (status === "unauthenticated") {
            router.push("/api/auth/signin");
        }
    }, [status, router]);

    useEffect(() => {
        if (status !== 'loading') {
            let messageWindow = document.getElementsByClassName('message-list')[0];
            if (messageWindow) {
                const messageWindowHeight = messageWindow.scrollHeight;
                messageWindow.scrollTop = messageWindowHeight;
                console.log(messageWindowHeight, messageWindow.scrollTop);
            }
        }
    }, [status])

    useEffect(() => {
        async function handleGetConversationUser(chatId: string, email: string) {

            const convUserRes = JSON.parse(await getConversationUser(chatId, email));
            setConvUser(convUserRes);
        };


        handleGetConversationUser(chat_id, session?.user?.email)

    }, [chat_id, session?.user?.email]);


    if (status === 'loading' || !convUser) {
        return <p>Loading session...</p>;
    }

    const messageList = messages.map((value, index) => {

        const msgDate = new Date(messages[index].createdAt);
        return (
            <div className={session?.user?.name === messages[index].user.name ? 'message message-self' : 'message'} key={messages[index]._id}>
                <div className='message-date'>{msgDate.toLocaleTimeString()}</div>
                <div className='message-user'>{messages[index].user.name}</div>
                <div className='message-text'>{messages[index].message}</div>
            </div>
        )
    })
//
        return (
            <div className='messages'>
                <h3 className='message-list-header'>
                    Conversation: {convUser?.name}
                    <VoipCallDynamic userEmail={session.user.email} targetUserEmail={convUser.email} />
                </h3>
                <div className='message-list'>
                    {messageList}
                </div>
            </div>
        )
}

export default Messages;

