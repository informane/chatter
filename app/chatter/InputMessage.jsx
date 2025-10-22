'use client';
function InputMessage(_a) {
    var chat_id = _a.chat_id;
    return (<form className='message-form'>
            <input type='text' name='message' id='message'/>
            <a href='javascript:void(0)' /*onClick={() => sendMessage()}*/>Send</a>
        </form>);
}
export default InputMessage;
