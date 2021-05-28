import { useState } from 'react';
import { useRouter } from 'next/router';

import Navbar from '../components/Navbar';
import Header from '../components/Header';

import styles from '../styles/Login.module.css';

import { postreq } from '../utils/request-utils';
import { setCookie, parseCookies } from 'nookies';

function login(){
    const router = useRouter();
    const cookies = parseCookies();

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
                    setCookie(null, 'token', data.token, {
                        maxAge: 30*24*60*60,
                        path:'/'
                    })
                    router.push('/dashboard');
                }
            })
        }
    }

    function enterSubmit(e) {
        if(e.key == 'Enter'){
            submitLogin();
        }
    }

    if(process.browser && cookies.token)
        router.push('/dashboard');

    return (
        <div>
            <Header title="Login"/>
            <Navbar linkCol='black'/>
            <div className={styles.mainBackground}>
                <div className={styles.loginBox}>
                    <h1 className = { styles.loginHeader }> LOGIN </h1>
                    <h1 className = { styles.errorMessage }> { errorMessage } </h1>
                    <input id = 'loginUsernameField' className = { styles.loginUsernameField } placeholder = 'Username' onKeyDown = { enterSubmit } />
                    <input id = 'loginPasswordField' className = { styles.loginPasswordField } placeholder = 'Password' type="password" onKeyDown = { enterSubmit } />
                    <button className = { styles.loginSubmitButton } onClick = { submitLogin }> SUBMIT </button>
                </div>
            </div> 
        </div>
    )
}

export default login