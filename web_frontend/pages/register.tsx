import React, { useState } from 'react';
import { useRouter } from 'next/router';

import Navbar from '../components/Navbar';
import Header from '../components/Header';

import styles from '../styles/Login.module.css';
import { setCookie, parseCookies } from 'nookies';
import { postreq } from '../utils/request-utils';

function Register() {
    let [errorMessage, setErrorMessage] = useState('');
    
    const router = useRouter();
    const cookies = parseCookies()

    async function submitRegister() {
        let email = (document.getElementById('registerEmailField') as HTMLInputElement).value;
        let username = (document.getElementById('registerUsernameField') as HTMLInputElement).value;
        let password = (document.getElementById('registerPasswordField') as HTMLInputElement).value;
        let repassword = (document.getElementById('registerConfirmPasswordField') as HTMLInputElement).value;

        if(username == '') setErrorMessage('Username cannot be empty');
        else if(password == '') setErrorMessage('Password cannot be empty');
        else if(password != repassword) setErrorMessage('Passwords do not match');
        else{
            postreq("/auth/register", undefined, {
                'email':email,
                'username':username,
                'password':password
            }, (data)=>{
                console.log(data)

                if(data['result'] != 'ok') setErrorMessage('Register Failed');
                else{
                    setCookie(null, 'token', data.token, {
                        maxAge: 30*24*60*60,
                        path:'/',
                        sameSite:true
                    })
                    router.push('/dashboard');
                }
            })
        }
    }

    if(process.browser && cookies.token)
        router.push('/dashboard');

    return (
        <div>
            <Header title="Register"/>
            <Navbar linkCol = 'black' />
            <div className = { styles.mainBackground }>
                <div className = { styles.loginBox }>
                    <h1 className = { styles.loginHeader }> REGISTER </h1>
                    <h1 className = { styles.errorMessage }> { errorMessage } </h1>
                    <input id="registerEmailField" className={ styles.loginUsernameField } placeholder='Email' />
                    <input id = 'registerUsernameField' className = { styles.loginUsernameField } style={{top:'33%'}} placeholder = 'Username' />
                    <input id = 'registerPasswordField' className = { styles.loginPasswordField } style ={{top:'46%'}} placeholder = 'Password' type="password" />
                    <input id = 'registerConfirmPasswordField' className = { styles.loginPasswordField } placeholder = 'Confirm Password' style = {{ top: '59%' }} type="password" />
                    <button className = { styles.loginSubmitButton } style = {{ top: '72%' }} onClick = { submitRegister }> Register </button>
                </div>
            </div>
        </div>
    );
}

export default Register;
