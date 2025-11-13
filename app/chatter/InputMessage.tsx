import { useState } from 'react';
import { ChatterProps } from '../lib/props';
import { sendMessage } from 'app/lib/chatter';

function InputMessage({chat_id}: ChatterProps) {
    const [messageText, setMessageText] = useState('');
    const [error, setError] = useState('');

    /*async function sendMessageHandler(e) {
        e.preventDefault();

        const message = e.target.children[0].value;
        console.log(message);
        const res = await sendMessage(message, chat_id);

        if(res.success) {
            setMessageText('');
            setError('');
        } else {

            setError(res.error);
        }
    }*/
    async function sendMessageHandler(formData: FormData) {
        
        const message = formData.get('message').toString();

        console.log(message);
        const res = await sendMessage(message, chat_id);

        if(res.success) {
            setMessageText('');
            setError('');
        } else {
            
            setError(res.error);
        }

    }

    
    return (
        <div className='message-form-wrapper'>
        <form className='message-form' action={sendMessageHandler} /*method='POST' onSubmit={(e) => handleSendMessage(e)}*/>
            <textarea name='message' id='message' onChange={(e)=> {setMessageText(e.target.value)}} value={messageText}>
            </textarea>
            <button type='submit'>Send</button>
        </form>
        <div className='error'>{error}</div>
        </div>
        
    )
}

export default InputMessage;