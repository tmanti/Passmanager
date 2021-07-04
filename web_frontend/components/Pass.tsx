import React, { useState } from 'react';
import { useRouter } from 'next/router';

import VisibilityIcon from '@material-ui/icons/Visibility';
import DeleteIcon from '@material-ui/icons/Delete';
import styles from '../styles/Directory.module.css';
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

    const [pass, setPass] = useState(null);

    function viewPass(){
        getreq("/pass/"+id, token, (data)=>{
            console.log("GOT PASS");
            if(data.result == "ko"){
                console.log("shid")
            } else {
                console.log(data)
            }
        })
    }

    function deletePass(){
        delreq("/pass/"+id, token, {}, ()=>{
            update()
        })
    }

    if(isFirst){
        return(
            <div className = { styles.fileEntryContainerNoHover } style = {{ borderTop: 0, borderBottom: isLast?'1px solid #00000033':'' }}>
                <h1 className = { styles.fileEntryComponent } style = {{ fontFamily: 'var(--bold-font)', paddingLeft: '0.5%', width: '60%' }}> Source </h1>
            </div>
        )
    }
    
    return(
        <div className = { styles.fileEntryContainerNoHover } style = {{borderBottom: isLast?'1px solid #00000033':'' }} >
            <IconButton className={styles.deleteEntry} disableRipple={true} disableFocusRipple={true} disableTouchRipple={true} onClick={()=>{
                deletePass()
            }}>
                <DeleteIcon />
            </IconButton>
            <div className={styles.fileEntryContainer} onClick = { viewPass } >
                <h1 className = { styles.fileEntryComponent } style = {{ width: '60%' }}> { source } </h1>
                {
                    pass?
                    <h1 className = { styles.fileEntryComponent } style = {{ width:'40%'}}> {pass} </h1>
                    :<IconButton className={styles.deleteEntry} disableRipple={true} disableFocusRipple={true} disableTouchRipple={true} onClick={()=>{
                        viewPass()
                    }}>
                        <VisibilityIcon/>
                    </IconButton>
                }
            </div>
        </div>
    )

}