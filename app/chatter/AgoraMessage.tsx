import { useEffect, useEffectEvent, useState, useRef } from "react";
import { AgoraMsgProps } from '../lib/props';
import { getConversationUser, setMessageRead } from "app/lib/chatter";
import { useSession } from "next-auth/react";
import { sendMessage } from 'app/lib/chatter'
import { Model } from "mongoose";
import Message, { IMessage, IMessageDocument } from './models/Message';
import { CreateTextMsgParameters } from "agora-chat/message/text";
import { CreateCustomMsgParameters } from "agora-chat/message/custom";

import agoraChat from "agora-chat";
/*import agoraToken from 'agora-token';
import AgoraRTM from 'agora-rtm-sdk';*/

/*
// just a mock channel name for /api/token route
const getRTMChannelName = (email1: string, email2: string) => {
    email1 = email1.replaceAll('.', '');
    email2 = email2.replaceAll('.', '');
    const sortedEmails = [email1, email2].sort();

    return `NEW_MESSAGE_${sortedEmails[0]}_${sortedEmails[1]}`;
};

//peer-to-peer connection user_id for signaling about new messages
const getRTMUserId = (email: string) => {
    email = email.replaceAll('.', '');
    return 'message_signaling_'+email;
}*/

export function AgoraMessage({ shown, onNewMessage, chat_id, currentUserEmail, targetUserEmail }: AgoraMsgProps) {
    //agora rtm (signaling)
    /*const { RTM } = AgoraRTM;
    const rtmClient = useRef(null);
    const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID;
    const rtmUserId = getRTMUserId(currentUserEmail);
    const rtmChannel = getRTMChannelName(currentUserEmail, targetUserEmail);
    const [isRtmLoggedIn, setIsRtmLoggedIn] = useState(true);*/
    //agora chat
    const [messagesWindow, setMessagesWindow] = useState(null);
    const noMessages = useRef(false)
    const prev_chat_id = useRef(null);
    const appKey = process.env.NEXT_PUBLIC_AGORA_CHAT_APP_KEY;
    const [userId, setUserId] = useState('');//user email without dots and @
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const { data: session, status } = useSession();
    const [peerId, setPeerId] = useState("");//peer email without dots
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [chatClient, setChatClient] = useState<any>(null);
    const [peerDbUser, setPeerDbUser] = useState({});
    const [AgoraChat, setAgoraChat] = useState(null);
    const [convUser, setConvUser] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (prev_chat_id.current == null) prev_chat_id.current = chat_id;
        if (noMessages.current) return;
        if (chat_id !== prev_chat_id.current) {
            noMessages.current = false;
            setAgoraChat(null);
            setChatClient(null);
            setUserId('');
            setMessages([]);
            prev_chat_id.current = chat_id;
            return;
        }

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
            setChatClient(client);

        };
        if (!chatClient && !AgoraChat) { initAgoraChat(); return; }

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
            if (!msgs.data.length) noMessages.current = true;
            else noMessages.current = false;
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
                    console.log('message: ' + message);
                    //if messages (state array loaded from db) contain sent message (because message was sent while target user was offline) 
                    // then we don't add it to messages.
                    let messageAlreadySent = false;
                    for (const msg of messages) {
                        if (msg._id === message.ext._id) {
                            messageAlreadySent = true;
                        }
                    }
                    if (!messageAlreadySent) {
                        setMessages(prevMessages => [...prevMessages, message.ext]);
                        if (shown) {
                            scrollDown();
                        } else {
                            onNewMessage(chat_id);//tell parent that messages of the chat are read now
                        }
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

        const handleScroll = function () {

            const unreadMessage = document.getElementsByClassName('message unread')[0];
            console.log(unreadMessage.scrollTop, messagesWindow.scrollTop);
            if (unreadMessage) {
                //const messageWindowHeight = messagesWindow.scrollHeight;


                if (messagesWindow.scrollTop >= unreadMessage.scrollTop) {
                    const msgId = unreadMessage.id;
                    setMessageRead(msgId);
                }
            }
        }

        if (/*status !== 'loading' && */convUser && messagesWindow) {
            setMessagesWindow(document.getElementsByClassName('message-list')[0]);
            console.log(document.getElementsByClassName('message-list')[0], messagesWindow)
            messagesWindow.addEventListener('scroll', handleScroll);
        }


        /* return () => {
             if (messagesWindow) messagesWindow.removeEventListener('scroll', handleScroll);
         };*/

        initEventListeners()

        if (shown) scrollDown();

        return () => {
            handleLogout();

        };

    }, [appKey, userId, chat_id, prev_chat_id, chatClient, messages, noMessages, convUser, status]);


    //handle if user scrolldown 
    useEffect(() => {



        //if (document.getElementsByClassName('message-list')[0]) {


    }, [])


    //rtm notification
    /*useEffect(() => {

 
        async function initMessageNotifications() {
            console.log('rtm vars:', rtmUserId, rtmChannel, appId)
            const response = await fetch(`/api/token?userId=${encodeURIComponent(rtmUserId)}&channelName=${encodeURIComponent(rtmChannel)}`);
            const data = await response.json();
            if (!data.rtmToken) {
                console.error("Token fetch failed or token is empty.");
                return; // Stop execution if no token
            }
            const client = new RTM(appId, rtmUserId);
            console.log('rtm_token:', data.rtmToken);
            await client.login({ token: data.rtmToken });
            setIsRtmLoggedIn(true);
            rtmClient.current = client;

            rtmClient.current.addEventListener('message', (event) => {
                const signal = event.customType;
                console.log('notify event:', event);
                if(signal == 'NEW_MSG') {
                    console.log(event.message);
                    const fromEmail = event.message;
                    onNewMessage(fromEmail);
                }

            });
        }
        if(!rtmClient.current) initMessageNotifications();

        return () => {
            handleRtmLogout()
        };

    }, [appId, rtmUserId, rtmChannel, rtmClient])

    const notifyUser = async (currentEmail: string, targetEmail: string) => {

        const payload = currentEmail;
        const options = {
            customType: "NEW_MSG",
            channelType: "USER",
        };
        await rtmClient.current.publish(getRTMUserId(targetEmail), payload, options);

    };*/

    // agora RTM Log out
    /*const handleRtmLogout = () => {
        if (rtmClient.current) {
            console.log('rtm logout');
            rtmClient.current.logout();
            setIsRtmLoggedIn(false);
        }
    };*/

    //agora chat send a peer-to-peer message.
    const handleSendMessage = async () => {
        if (message.trim() === '' || !chatClient) return;
        try {
            console.log("msg before db", process.env.NEXT_PUBLIC_BASE_URL);
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
            };
            let newAgoraMsg = AgoraChat.message.create(options);

            await chatClient.send(newAgoraMsg);
            //notifyUser(currentUserEmail, targetUserEmail);
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
        let firstUnreadMessage = document.getElementsByClassName('message unread')[0];
        if (messageWindow) {
            if (firstUnreadMessage) {
                messageWindow.scrollTop = firstUnreadMessage.scrollTop;
            } else {
                messageWindow.scrollTop = messageWindow.scrollHeight;
            }
        }
    }

    //remove dots and @ for compatibility
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
        if (userId && token) {
            chatClient.open({
                user: userId,
                accessToken: token,
            });
            setIsLoggedIn(true);
        } else {
            console.log("Please enter userId and token");
        }
    };

    // agora Log out
    const handleLogout = () => {
        console.log('Chat logout')
        chatClient.close();
        setIsLoggedIn(false);
    };

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
        let className = messages[index].status;
        return (
            <div className={session?.user?.email === messages[index].user.email ? 'message message-self ' + className : 'message ' + className} id={messages[index]._id} key={messages[index]._id}>
                <div className='message-date'>{msgDate.toLocaleTimeString()}</div>
                <div className='message-user'>{messages[index].user.name}</div>
                <div className='message-text'>{messages[index].message}</div>
            </div>
        )
    })

    return (
        <article className='agora'>
            <div className='messages'>
                <h3 className='message-list-header'>
                    Conversation: {convUser?.name}
                </h3>
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