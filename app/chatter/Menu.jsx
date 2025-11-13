import { useState } from 'react';
import { useSession, signIn, signOut } from "next-auth/react";
import Modal from './Modal';
import UserSearch from './UserSearch';
export default function Menu() {
    var _a;
    var _b = useState(false), modalMenuIsOpen = _b[0], setModalMenuIsOpen = _b[1];
    var _c = useSession(), session = _c.data, status = _c.status;
    if (status === 'loading') {
        return <p>Loading session...</p>;
    }
    var email = (_a = session === null || session === void 0 ? void 0 : session.user) === null || _a === void 0 ? void 0 : _a.email;
    return (<div className='menu'>
            <button onClick={function () { return setModalMenuIsOpen(true); }} className='menu-btn'>Menu</button>
            <Modal className='menu' isOpen={modalMenuIsOpen} onClose={function () { return setModalMenuIsOpen(false); }}>
                {email && <UserSearch />}
                {email ?
            <button className='primary-btn' onClick={function () { return signOut({ callbackUrl: "/api/auth/signin" }); }}>Sign out({email}) </button> :
            <button className='primary-btn' onClick={function () { return signIn(); }}>Sign in</button>}
            </Modal>
        </div>);
}
