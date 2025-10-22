'use client'

import { useSession } from "next-auth/react";
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import Search from './Search';

export default function UserSearch() {
    const [Users, setUsers] = useState([]);
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const [term, setTerm] = useState(searchParams.get('query') ?? '');

    useEffect(()=>{
        const searchUsers = async (term: string) => {
           if(term.length){
                const promise = await fetch('/api/user?query='+term);
                const Users = await promise.json();
                console.log(Users.data);
                setUsers(Users.data);
            } else {
                setUsers([]);
            }
            
        }

        searchUsers(term);

    },[term])

    function addToContacts(e: React.MouseEvent<HTMLElement>) {
        e.target;
        const fetchedChat = fetch('/api/chat/current', {
            method: 'POST',
            headers: {
                'content-type': ''
            }
        })
    }

    function renderUsers() {
        if(!Users.length) return <p>Start searching!</p>

        var users = Users.map((value, index) => {
            return (
                <div key={Users[index]._id} className='user'>
                    <img src={Users[index].avatar} alt={Users[index].email}/>
                    <div className='user-name'>{Users[index].name}</div>
                    <div className='user-email'>{Users[index].email}</div>
                    <div className='user-description'>{Users[index].description}</div>
                    <div className="user-add">
                        <button id={Users[index]._id} className="user-add-button" onClick={addToContacts}>Add to contancts</button>
                    </div>
                </div>
            )
        })
        return  <div className='user-list'>{users}</div>
    }

    return (
        <div className='users'>
            <h2>Search Users</h2>
            <Search model='user' placeholder='search users' onTermChange={setTerm}/>
            {renderUsers()}
        </div>
    )
}
