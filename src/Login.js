import React, { useState } from 'react';
import api from './api';

const createFriend = (newUser, history) => {
    if (newUser.first_name && newUser.last_name && newUser.phone_number) {
        api.friends().create({ ...newUser, friend_photo: newUser.friend_photo || null }).then((res) => {
            console.log(res);
            history.push({
                pathname: '/home',
                state: { user_id: res.data.friend_id }
            });
        });
    }
};

const login = (id, history) => {
    if (id) {
        api.friends().getOne(id).then((res) => {
            console.log(res);
            if (res.status == 200) {
                history.push({
                    pathname: '/home',
                    state: { user_id: id }
                });
            }
        });
    }
}

const Login = (props) => {
    const [newUser, setNewUser] = useState({});
    const [userId, setUserId] = useState(0);
    return (
        <>
            <h1>Welcome to Plans For You</h1>
            <p>To continue, please enter your user id below:</p>
            <input onChange={(e) => setUserId(e.target.value)} type="text" />
            <button onClick={() => login(userId, props.history)}>Log in</button>
            <p>If you don't yet have an account, please register below:</p>
            <p><strong>First name</strong></p>
            <input onChange={(e) => setNewUser({ ...newUser, first_name: e.target.value })} type="text" />
            <p><strong>Last name</strong></p>
            <input onChange={(e) => setNewUser({ ...newUser, last_name: e.target.value })} type="text" />
            <p><strong>Phone number</strong></p>
            <input onChange={(e) => setNewUser({ ...newUser, phone_number: e.target.value })} type="tel" />
            <p><strong>Profile photo (url)</strong></p>
            <input onChange={(e) => setNewUser({ ...newUser, friend_photo: e.target.value })} type="text" />
            <button onClick={() => createFriend(newUser, props.history)}>Register</button>
        </>
    );
};

export default Login;