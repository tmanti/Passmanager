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
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';

import styles from '../styles/Dashboard.module.css';

import { parseCookies } from 'nookies';
import { getreq, postreq } from '../utils/request-utils'
import Header from '../components/Header';

const drawerWidth = 240;

export default function Dashboard() {
  const router = useRouter();
  const cookies = parseCookies();

  const token  = cookies.token;

  const [passes, setPasses] = useState([]);

  let [showCreatePopup, setCreatePopup] = useState(false);
  let [popupErrorMessage, setPopupErrorMessage] = useState('');
  
  if(!token && process.browser){
    router.push("/login")
  }
  
  getreq("/pass", token, (data)=>{
    console.log("GOT PASSES");
    if(data.status == "ko"){
      console.log("oh no")
    } else {
      console.log(data.results)
    }
  })

    return (
    <div>
        <Header title="Dashboard"/>
        <div style={{display: 'flex'}}>
            <CssBaseline />
            <AppBar position="static" className={styles.appBar}>
                <Toolbar>
                    <Typography variant="h6">
                        Passmanager
                    </Typography>
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
                {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                    <ListItem button key={text}>
                        <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
                </List>
            <Divider />
            </Drawer>
        </div>
        <div className = {styles.userBackground}>

        </div>
    </div>
  );
}