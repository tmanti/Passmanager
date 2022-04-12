import React, { useState } from 'react';
import { useRouter } from 'next/router';

import VisibilityIcon from '@material-ui/icons/Visibility';
import DeleteIcon from '@material-ui/icons/Delete';
import styles from '../styles/Pass.module.css';
import { IconButton } from '@material-ui/core';

import { getreq, postreq, delreq } from '../utils/request-utils'

interface PassProps{
    id: string,
    token: string,
    source: string,
    isLast: boolean,
    isFirst: boolean,
    update: Function
}

export default function Pass({source, token, id, isFirst, isLast, update}:PassProps){

    let [pass, setPass] = useState(null);
    let deleted = false;
    let viewed = false;

    function viewPass(){
        viewed = true;
        if(!deleted && viewed){
            getreq("/pass/"+id, token, (data)=>{
                if(data.result == "ko"){
                    console.log("shid")
                } else {
                    setPass(data.password)
                }
            })
        }
    }

    function deletePass(){
        deleted = true;
        setPass(null)
        delreq("/pass/"+id, token, {}, (data)=>{
            update()
        })
    }

    if(isFirst){
        return(
            <div className = { styles.fileEntryContainerNoHover } style = {{ borderTop: 0, borderBottom: isLast?'1px solid #00000033':'' }}>
                <h1 className = { styles.fileEntryComponent } style = {{ fontFamily: 'var(--bold-font)', paddingLeft: '0.5%'}}> Source </h1>
            </div>
        )
    }
    
    return(
        <div className = { styles.fileEntryContainerNoHover } style = {{borderBottom: isLast?'1px solid #00000033':'' }} >
            <div className={styles.fileEntryContainer} onClick = { viewPass } >
            <h1 className = { styles.fileEntryComponent } style = {{ }}> { source } </h1>
                <IconButton className={styles.viewEntry} disableRipple={true} disableFocusRipple={true} disableTouchRipple={true} onClick={()=>{
                        deletePass()
                    }}>
                    <DeleteIcon />
                </IconButton>
                {
                    pass?
                    <h1 className = { styles.passEntry }> {pass} </h1>
                    :<IconButton disabled={viewed} className={styles.viewEntry} disableRipple={true} disableFocusRipple={true} disableTouchRipple={true} onClick={()=>{
                        viewPass()
                    }}>
                        <VisibilityIcon/>
                    </IconButton>
                }
            </div>
        </div>
    )

}