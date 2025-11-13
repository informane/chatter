'use client'

import { useSession } from "next-auth/react";
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { addToContacts } from "app/lib/chatter";
import Search from './Search';
import Modal from './Modal';


export default function UserSearch() {
    const [Users, setUsers] = useState([]);
    const [error, setError] = useState({message: null});
    const [success, setSuccess] = useState({message: null});
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const [term, setTerm] = useState(searchParams.get('contact-search') ?? '');
    const [modalSearchIsOpen, setModalSearchIsOpen] = useState(false);

    useEffect(() => {
        const searchUsers = async (term: string) => {
            if (term.length) {
                const promise = await fetch('/api/user?query=' + term);
                const Users = await promise.json();

                console.log(Users.data);
                setUsers(Users.data);
            } else {
                setUsers([]);
            }
            setSuccess({message: null});
            setError({message: null});
        }

        searchUsers(term);

    }, [term])

    async function handleAddContact(user_id) {
        const res = await addToContacts(user_id);
        if(!res.success) {
            setSuccess({message: null});
            setError({message: res.error});
        } else {
            setSuccess({message: "Successfull added to contacts!"});
            setError({message: null});
        }
    }
    function renderUsers() {
        if (!Users.length) return <p></p>

        var users = Users.map((value, index) => {
            return (
                <div key={Users[index]._id} className='user'>
                    <Image src={Users[index].avatar} alt={Users[index].name}  height={60} width={60}/>
                    <div className="user-details">
                        <div className='user-name'>{Users[index].name}</div>
                        <div className='user-email'>{Users[index].email}</div>
                        <div className='user-description'>{Users[index].description}</div>
                        <div>
                            <button className="user-add-button" onClick={(e) => handleAddContact(Users[index]._id)}>Add to contancts</button>
                        </div>
                    </div>
                </div>
            )
        })
        return <div className='users-list'>{users}</div>
    }



    return (
        <div className='users-add'>
            <button onClick={()=>setModalSearchIsOpen(true)}>Add new contact</button>
            <Modal isOpen={modalSearchIsOpen} onClose={()=>setModalSearchIsOpen(false)}>
                <Search queryVar='contact-search' placeholder='start typing' onTermChange={setTerm} />
                <div className="success">{success.message}</div>
                <div className="error">{error.message}</div>
                {renderUsers()}
            </Modal>
        </div>
    )
}
