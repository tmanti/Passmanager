import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { fade, createStyles, Theme, makeStyles, StylesProvider } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import AddIcon from '@material-ui/icons/Add';

import styles from '../styles/Dashboard.module.css';

import { parseCookies } from 'nookies';
import { getreq, postreq } from '../utils/request-utils'
import Header from '../components/Header';
import Pass from '../components/Pass';

const drawerWidth = 240;

export default function Dashboard() {
    const router = useRouter();
    const cookies = parseCookies();

    const token  = cookies.token;

    const [passes, setPasses] = useState([]);

    let [showCreatePopup, setCreatePopup] = useState(false);
    let [popupErrorMessage, setPopupErrorMessage] = useState('');
    let [firstTime, setFirstTime] = useState(true);
    
    if(!token && process.browser){
        router.push("/login")
    }
    
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
            if(data.status == "ko"){
                console.log("oop")
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
        <div style={{display: 'flex'}}>
            <CssBaseline />
            <AppBar className={styles.appBar}>
                <Toolbar>
                    {/*<Typography variant="h6">
                        Passmanager
    </Typography>*/}
                    <div className={styles.search}>
                        <div className={styles.searchIcon}>
                            <SearchIcon />
                        </div>
                        <InputBase
                            placeholder="Search…"
                            classes={{
                                root: styles.inputRoot,
                                input: styles.inputInput,
                            }}
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </div>
                </Toolbar>
            </AppBar>
            <Drawer
                className={styles.drawer}
                variant="permanent"
                classes={{
                    paper: styles.drawerPaper,
                }}
                anchor="left"
            >
            <Divider />
            <List>
                <ListItem button key={"test"}>
                    <ListItemIcon> </ListItemIcon>
                    <ListItemText primary={"asd"} />
                </ListItem>
            </List>
            <Divider />
            <List>
                <ListItem button onClick={()=>{setCreatePopup(true)}}>
                    <ListItemIcon><AddIcon/></ListItemIcon>
                    <ListItemText primary={"New Password"} />
                </ListItem>
            </List>
            </Drawer>
        </div>
        <div className = {styles.userBackground} style={{top:'65px'}}>
            <Pass source={null} token={null} id={null} isFirst={true} isLast={false} update={updateDash}/>
            {
                passes.map((element, index)=>{
                    return <Pass source={element.source} token={token} id={element.id} isFirst={false} isLast={index==passes.length-1} update={updateDash}/>
                })
            } 
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
  );
}