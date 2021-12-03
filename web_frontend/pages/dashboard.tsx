import { useState, useEffect } from 'react';
import { useRouter } from "next/router";
import { destroyCookie, parseCookies } from "nookies";

import { getreq, postreq } from '../utils/request-utils'

import Header from '../components/Header';
import Pass from '../components/Pass';

import styles from '../styles/Dashboard.module.css';
import { CssBaseline, Fab, Tooltip, IconButton } from '@material-ui/core';
import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';

export default function Dashboard(){
    const router = useRouter();
    const cookies = parseCookies();

    const token = cookies.token

    const [passes, setPasses] = useState([]);

    let [showCreatePopup, setCreatePopup] = useState(false);
    let [popupErrorMessage, setPopupErrorMessage] = useState('');
    let [firstTime, setFirstTime] = useState(true);

    useEffect(()=>{
        if(!token){
            router.push("/login")
        }else{
            if(firstTime){
                setFirstTime(false);
                try{
                    getreq("/pass", token, (data)=>{
                        console.log("GOT PASSES");
                        if(data.status == "ko"){
                            console.log("oh no")
                        } else {
                            console.log(data.results)
                            setPasses(data.results)
                        }
                    })
                } catch(e){
                    console.log(e)
                }
            }
        }
    })

    function updateDash(){
        getreq("/pass", token, (data)=>{
            console.log("GOT PASSES");
            if(data.status == "ko"){
                console.log("oh no")
            } else {
                console.log(data.results)
                setPasses(data.results)
            }
        })
    }

    async function addPassword(source, pass){
        let req = {
            source:source,
            password:pass
        }
        postreq('/pass/', token, req, (data)=>{
            if(data.result == "ko"){
                if(data.status == 401){
                    destroyCookie(null, "token");
                    router.push("/login")
                }
            } else {
                setCreatePopup(false)
                updateDash()
            }
        })
    }

    function attemptAddPass(){
        let source=(document.getElementById('create-source') as HTMLInputElement).value
        let pass=(document.getElementById('create-pass') as HTMLInputElement).value
        if(source == '' || pass == '') setPopupErrorMessage('Please fill out all fields');
        else addPassword(source, pass)
    }

    return (
        <div>
            <Header title="Dashboard"/>
            <div>
                <div style={{display: 'flex'}}>
                    <CssBaseline />
                </div>
                <div className = {styles.userBackground}>
                    <Pass source={null} token={null} id={null} isFirst={true} isLast={false} update={updateDash}/>
                    {
                        passes.map((element, index)=>{
                            return <Pass key={element.id} source={element.source} token={token} id={element.id} isFirst={false} isLast={index==passes.length-1} update={updateDash}/>
                        })
                    } 
                    {
                !showCreatePopup?
                    <Fab style={{position:'fixed'}} sx={{ display:'fixed' }} color="primary" className={styles.addButton} onClick={()=>{
                        setCreatePopup(true)
                    }}>
                        <AddIcon/>
                    </Fab>
                    :null
                }
                </div>
            </div>

            {
                showCreatePopup?
                <div className={styles.popupContainer}>
                    <div className={styles.popupInnerContainer}>
                        <h1 className = { styles.popupHeader }> New Password </h1>
                        <h1 className = { styles.popupError }> { popupErrorMessage } </h1>
                        <h1 className = { styles.popupEntryHeader }> Source </h1>
                        <input id = 'create-source' className = { styles.popupEntryInput } placeholder = 'Password Source' />
                        <h1 className = { styles.popupEntryHeaderPassword }> Password </h1>
                        <input id = 'create-pass' type="password" className = { styles.popupEntryInputPassword } placeholder = 'Password' />
                        <div className = { styles.popupBottom }>
                            <button className = { styles.popupConfirm } onClick = { attemptAddPass }> Confirm </button>
                            <button className = { styles.popupCancel } onClick = { () => setCreatePopup(false) }> Cancel </button>
                        </div>
                    </div>
                </div>
                :null
            }
        </div>
    )
}