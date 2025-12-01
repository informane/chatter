var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
import { useState } from 'react';
import { useSession, signIn, signOut } from "next-auth/react";
import Modal from './Modal';
export default function Menu() {
    var _a;
    var _b = __read(useState(false), 2), modalMenuIsOpen = _b[0], setModalMenuIsOpen = _b[1];
    var _c = useSession(), session = _c.data, status = _c.status;
    if (status === 'loading') {
        return <p>Loading session...</p>;
    }
    var email = (_a = session === null || session === void 0 ? void 0 : session.user) === null || _a === void 0 ? void 0 : _a.email;
    return (<div className='menu'>
            <button onClick={function () { return setModalMenuIsOpen(true); }} className='menu-btn'>Menu</button>
            <Modal className='menu' isOpen={modalMenuIsOpen} onClose={function () { return setModalMenuIsOpen(false); }}>
                {/*email && <UserSearch  onUpdateChatList={onUpdateChatList}/>*/}
                {email ?
            <button className='primary-btn' onClick={function () { return signOut({ callbackUrl: "/api/auth/signin" }); }}>Sign out({email}) </button> :
            <button className='primary-btn' onClick={function () { return signIn(); }}>Sign in</button>}
            </Modal>
        </div>);
}
