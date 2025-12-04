import { useState } from 'react';
import { useSession, signIn, signOut } from "next-auth/react";
import Modal from './Modal';
export default function Menu() {
    var _a;
    const [modalMenuIsOpen, setModalMenuIsOpen] = useState(false);
    const { data: session, status } = useSession();
    if (status === 'loading') {
        return <p>Loading session...</p>;
    }
    const email = (_a = session === null || session === void 0 ? void 0 : session.user) === null || _a === void 0 ? void 0 : _a.email;
    return (<div className='menu'>
            <button onClick={() => setModalMenuIsOpen(true)} className='menu-btn'>Menu</button>
            <Modal className='menu' isOpen={modalMenuIsOpen} onClose={() => setModalMenuIsOpen(false)}>
                {/*email && <UserSearch  onUpdateChatList={onUpdateChatList}/>*/}
                {email ?
            <button className='primary-btn' onClick={() => signOut({ callbackUrl: "/api/auth/signin" })}>Sign out({email}) </button> :
            <button className='primary-btn' onClick={() => signIn()}>Sign in</button>}
            </Modal>
        </div>);
}
