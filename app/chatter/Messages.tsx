'use client'

import  { useState, useEffect } from 'react';

import { ChatterProps } from '../lib/props';
import { IMessageDocument } from './models/Message';
import { IUserDocument } from './models/User';
import { useSession } from "next-auth/react";
import type { Session, User } from '@auth/core/types';

function Messages({chat_id}: ChatterProps) {

    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const { data: session, status } = useSession();

   //const [state, formAction, isPending] = useActionState(fn, initialState, permalink?);
    useEffect(() => {
    

        async function initialFetch(chat_id: number){
            const msgPromise = await fetch('/api/message/current?chat_id='+chat_id);
            const msgs = await msgPromise.json();
            setMessages(msgs);
        }

        //initialFetch(chat_id);

        const eventSource = new EventSource('/api/message/current/update?chat_id='+chat_id);

        eventSource.onmessage = (event) => {
            setMessages(event.data.msgs);
            setUsers(event.data.users);
        }

        eventSource.onerror = (error) => {
            console.log(error);
            eventSource.close()
        }

        return () => {
            eventSource.close();
        };

    },[]);  


    function getSessionUser(): User | boolean{
        
        if (session != null) {
            if (session.user != null) {
                return session.user
            }
        } 
        return false;
    }

    if (status === 'loading') {
      return <p>Loading session...</p>;
    }

    let messageMap: IMessageDocument[] = messages;  
    let userMap: IUserDocument[] = users;  
    let user: User | boolean = getSessionUser();
    if(user != null && typeof(user) == 'object') {
        if("name" in user) {
            var chatName = user.name
        } 
    } else {
        return <p>User not Found</p>
    }

    const messageList = messageMap.map((value, index) => {
        return (
            <div className='message'>
                <div className='message-date'>{messageMap[index].createdAt.toDateString()}</div>
                <div className='message-user'>{userMap[index].name}</div>
                <div className='message-text'>{messageMap[index].message}</div>
            </div>
        )
    })
    
    return (
        <div>
            <h2 className='message-list-header'> Coversation: {chatName}</h2>
            <div className='message-list'>{messageList.join()}</div>
        </div>
    )
}

export default Messages;

