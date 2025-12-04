'use client';
import { useState, useEffect } from 'react';
import { getConversationUser } from '../lib/chatter';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
function Messages({ chat_id }) {
    var _a;
    const [messages, setMessages] = useState([]);
    const [convUser, setConvUser] = useState(null);
    const eventSourceRef = useRef(null);
    const { data: session, status } = useSession();
    //const [state, formAction, isPending] = useActionState(fn, initialState, permalink?);
    useEffect(() => {
        async function initialFetch(chat_id) {
            const msgPromise = await fetch('/api/message/current?chat_id=' + chat_id);
            const msgs = await msgPromise.json();
            setMessages(msgs.data);
            //console.log(messages, msgs.data);
        }
        initialFetch(chat_id);
        if (eventSourceRef.current)
            return;
        const eventSource = new EventSource('/api/message/current/update?chat_id=' + chat_id);
        eventSourceRef.current = eventSource;
        eventSourceRef.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            const addedMessage = data;
            setMessages(prevMessages => [...prevMessages, addedMessage]);
        };
        eventSourceRef.current.onerror = (error) => {
            console.log(JSON.stringify(error));
            eventSourceRef.current.close();
        };
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
    }, [status]);
    useEffect(() => {
        var _a;
        async function handleGetConversationUser(chatId, email) {
            const convUserRes = JSON.parse(await getConversationUser(chatId, email));
            setConvUser(convUserRes);
        }
        ;
        handleGetConversationUser(chat_id, (_a = session === null || session === void 0 ? void 0 : session.user) === null || _a === void 0 ? void 0 : _a.email);
    }, [chat_id, (_a = session === null || session === void 0 ? void 0 : session.user) === null || _a === void 0 ? void 0 : _a.email]);
    if (status === 'loading' || !convUser) {
        return <p>Loading session...</p>;
    }
    const messageList = messages.map((value, index) => {
        var _a;
        const msgDate = new Date(messages[index].createdAt);
        return (<div className={((_a = session === null || session === void 0 ? void 0 : session.user) === null || _a === void 0 ? void 0 : _a.name) === messages[index].user.name ? 'message message-self' : 'message'} key={messages[index]._id}>
                <div className='message-date'>{msgDate.toLocaleTimeString()}</div>
                <div className='message-user'>{messages[index].user.name}</div>
                <div className='message-text'>{messages[index].message}</div>
            </div>);
    });
    //<VoipCallDynamic userEmail={session.user.email} targetUserEmail={convUser.email} />
    return (<div className='messages'>
                <h3 className='message-list-header'>
                    Conversation: {convUser === null || convUser === void 0 ? void 0 : convUser.name}
                    
                </h3>
                <div className='message-list'>
                    {messageList}
                </div>
            </div>);
}
export default Messages;
