import { useState } from 'react';
import { useSession, signIn, signOut } from "next-auth/react"
import Modal from './Modal';
import UserSearch from './UserSearch';


export default function Menu() {

    const [modalMenuIsOpen, setModalMenuIsOpen] = useState(false);
    const { data: session, status } = useSession();
    if (status === 'loading') {
        return <p>Loading session...</p>;
    }

    const email = session?.user?.email;

    return (
        <div className='menu'>
            <button onClick={()=>setModalMenuIsOpen(true)} className='menu-btn'>Menu</button>
            <Modal className='menu' isOpen={modalMenuIsOpen} onClose={() => setModalMenuIsOpen(false)}>
                {email && <UserSearch />}
                {email ?
                    <button className='primary-btn' onClick={() => signOut({ callbackUrl: "/api/auth/signin" })}>Sign out({email}) </button> :
                    <button className='primary-btn' onClick={() => signIn()}>Sign in</button>
                }
            </Modal>
        </div>
    );
}