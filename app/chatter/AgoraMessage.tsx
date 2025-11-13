import { useEffect, useEffectEvent, useState, useRef } from "react";
import { ChatterProps } from '../lib/props';
import { getConversationUser } from "app/lib/chatter";
import { useSession } from "next-auth/react";
import { sendMessage } from 'app/lib/chatter';

import { CreateTextMsgParameters } from "agora-chat/message/text";
import { CreateCustomMsgParameters } from "agora-chat/message/custom";

import agoraChat from "agora-chat";
import agoraToken from 'agora-token';
const { ChatTokenBuilder } = agoraToken;

export function AgoraMessage({ chat_id, shown }: ChatterProps) {
    const [error, setError] = useState('');

    //agora chat
    const appKey = process.env.NEXT_PUBLIC_AGORA_CHAT_APP_KEY;
    const [userId, setUserId] = useState('');//user email without dots and @
    //const [token, setToken] = useState("007eJxTYLicO+0l5ww+23e/7y9LaWo00Jx1OfXBnXOzr8tprdjEdEhFgcHSIiUtLc3IJNU42dLE0DjR0iwtxdQiMTHVPM00ydjY6O0EkcyGQEaG/llfWBgZWBkYgRDEV2FITEw0N04yM9BNSktO1TU0TDPQTUxMTtE1tDQzApqVbGqUnAIAjNQq3Q==");
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const { data: session, status } = useSession();
    const [peerId, setPeerId] = useState("");//peer email without dots
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [chatClient, setChatClient] = useState<any>(null);
    const [peerDbUser, setPeerDbUser] = useState({});
    const [AgoraChat, setAgoraChat] = useState(null);


    useEffect(() => {

        //set userId
        if (!userId || status === 'loading') {
            setUserId(getUserId(session.user.email));
            return;
        }

        // Use a dynamic import inside useEffect 
        // and init Chat
        const initAgoraChat = async () => {
            // This code runs only in the browser, after the initial render
            var { default: AgoraChatImport } = await import('agora-chat');
            setAgoraChat(AgoraChatImport);

            if (!appKey) {
                console.error("Agora Chat App Key not found.");
                return;
            }

            // Initializes the Web client.
            const client = new AgoraChatImport.connection({
                appKey: appKey,
            });
            console.log(client)
            setChatClient(client);

        };
        if (!chatClient && !AgoraChat) { initAgoraChat(); return; }

        //set peer vars
        const initAgoraLogin = async () => {

            const peerUserJson = await getConversationUser(chat_id, session.user.email);
            const peerUser = await JSON.parse(peerUserJson);
            setPeerDbUser(peerUser);
            setPeerId(getUserId(peerUser.email));
            await handleLogin();
        }
        initAgoraLogin();

        //get messages from db
        async function initialFetch(chat_id: string) {
            const msgPromise = await fetch('/api/message/current?chat_id=' + chat_id);
            const msgs = await msgPromise.json();
            setMessages(msgs.data);
            //console.log(messages, msgs.data);
        }
        if (!messages.length) initialFetch(chat_id);

        //event listeners
        function initEventListeners() {

            // Adds the event handler.
            chatClient.addEventHandler("connection&message", {
                onConnected: () => {
                    handleLogin();
                    console.log(`User ${userId} Connect success !`);
                },
                onDisconnected: () => {
                    handleLogout();
                    console.log(`User Logout!`);
                },
                onCustomMessage: (message) => {
                    console.log('message: '+message);
                    let messageAlreadySent = false;
                    for (const msg of messages) {
                        if (msg._id === message.ext._id) {
                            messageAlreadySent = true;
                        }
                    }
                    if (!messageAlreadySent) {
                        setMessages(prevMessages => [...prevMessages, message.ext]);
                        scrollDown();
                    }
                    console.log(`${message.from} sent msg`);
                },
                onTokenWillExpire: () => {
                    console.log("Token is about to expire");
                },
                onTokenExpired: () => {
                    console.log("Token has expired");
                },
                onError: (error) => {
                    console.log(`on error: ${(error.message)}`);
                },
            });
        }

        initEventListeners()

        scrollDown();

        return handleLogout;

    }, [appKey, userId, chat_id, chatClient, messages]);


    //agora chat send a peer-to-peer message.
    const handleSendMessage = async () => {
        if (message.trim() === '' || !chatClient) return;
        try {
            console.log("msg before db");
            const addedMsg = await sendMessage(message, chat_id);
            if (!addedMsg.success) console.log(addedMsg.error);
            console.log("msg db", addedMsg);

            const newMsg = addedMsg.data;
            //let chatType: ChatType = 'singleChat';
            const options = {
                chatType: 'singleChat', // Sets the chat type as a one-to-one chat.
                type: "custom",
                event: 'MESSAGE_SENT',
                ext: newMsg,
                to: peerId,
                //msg: message,
            };
            let newAgoraMsg = AgoraChat.message.create(options);

            await chatClient.send(newAgoraMsg);

            //const newMessages = [...messages, newMsg]
            setMessages(prevMessages => [...prevMessages, newMsg]);

            console.log(newMsg)
            console.log(`Message send to ${peerId}: ${message}`);
            scrollDown();
            setMessage("");
        } catch (error) {
            console.log(`Message send failed: ${error.message}`);
        }

    };

    function scrollDown() {
        let messageWindow = document.getElementsByClassName('message-list')[0];
        if (messageWindow) {
            const messageWindowHeight = messageWindow.scrollHeight;
            messageWindow.scrollTop = messageWindowHeight;
        }
    }

    //remove dots for compatibility
    const getUserId = (email: string) => {
        email = email.replaceAll('.', '').replaceAll('@', '');
        return email;
    }



    // Log into Agora Chat
    const handleLogin = async () => {

        const response = await fetch('/api/chat_token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: userId }),
        });
        const data = await response.json();
        const token = data.token;
        console.log(userId, token)
        if (userId && token) {
            chatClient.open({
                user: userId,
                accessToken: token,
            });
        } else {
            console.log("Please enter userId and token");
        }
    };

    // agora Log out
    const handleLogout = () => {
        chatClient.close();
        setIsLoggedIn(false);
    };

    if (status === 'loading') {
        return <p>Loading session...</p>;
    }


    const messageList = messages.map((value, index) => {

        const msgDate = new Date(messages[index].createdAt);
        return (
            <div className={session?.user?.email === messages[index].user.email ? 'message message-self' : 'message'} key={messages[index]._id}>
                <div className='message-date'>{msgDate.toLocaleTimeString()}</div>
                <div className='message-user'>{messages[index].user.name}</div>
                <div className='message-text'>{messages[index].message}</div>
            </div>
        )
    })

    return (
        <article className={shown ? '' : 'hidden'}>
            <div className='messages'>
                <div className='message-list'>
                    {messageList}
                </div>
            </div>
            <div className='message-form-wrapper'>
                <form className='message-form' method='POST'>
                    <textarea name='message' id='message' onChange={(e) => { setMessage(e.target.value) }} value={message}>
                    </textarea>
                    <button type='button' onClick={handleSendMessage}>Send</button>
                </form>
                <div className='error'>{error}</div>
            </div>
        </article>
    )
}