import { useState } from 'react';
import { useRouter } from 'next/router';

import Navbar from '../components/Navbar';
import Header from '../components/Header';

import styles from '../styles/Login.module.css';

import { postreq } from '../utils/request-utils';

function login(){
    const router = useRouter();

    let [errorMessage, setErrorMessage] = useState('');

    function submitLogin(){
        let username = (document.getElementById('loginUsernameField') as HTMLInputElement).value;
        let password = (document.getElementById('loginPasswordField') as HTMLInputElement).value;

        if(username == '') setErrorMessage('Username cannot be empty');
        else if(password == '') setErrorMessage('Password cannot be empty');
        else{
            postreq("/auth/login", undefined,  {
                "username":username,
                "password":password
            }, (data)=>{
                console.log(data)

                if(data['status'] != 'ok') setErrorMessage('Login failed');
                else{
                    
                }
            })
        }
    }

    function enterSubmit(e) {
        if(e.key == 'Enter'){
            submitLogin();
        }
    }


    return (
        <div>
            <h1 className = { styles.loginHeader }> LOGIN </h1>
            <h1 className = { styles.errorMessage }> { errorMessage } </h1>
            <input id = 'loginUsernameField' className = { styles.loginUsernameField } placeholder = 'Username' onKeyDown = { enterSubmit } />
            <input id = 'loginPasswordField' className = { styles.loginPasswordField } placeholder = 'Password' type="password" onKeyDown = { enterSubmit } />
            <button className = { styles.loginSubmitButton } onClick = { submitLogin }> SUBMIT </button>
        </div>
    )
}

export default login