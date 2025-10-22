'use client'

import { useContext } from 'react';
import { ChatterProps } from '../lib/props';

function InputMessage({chat_id}: ChatterProps) {


    return (
        <form className='message-form'>
            <input type='text' name='message' id='message'/>
            <a href='javascript:void(0)' /*onClick={() => sendMessage()}*/>Send</a>
        </form>
    )
}

export default InputMessage;