import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';
import styles from '../styles/Navbar.module.css';

const Navbar = ({linkCol}:{ linkCol: string }) =>{//https://github.com/maticzav/nookies#readme
    const router = useRouter();
    const cookies = parseCookies()

    let obj1 = 
    <div className = { styles.navbarLinkRightContainer }>
        <h1 className = { styles.navbarLink } style = {{ color: linkCol }} onClick = { () => router.push('/register') }> 
            REGISTER
        </h1>
    </div>
    
    let obj2 =
    <div className = { styles.navbarLinkRightContainer }>
        <h1 className = { styles.navbarLink } style = {{ color: linkCol }} onClick = { () => router.push('/login') }> 
            LOGIN
        </h1>
    </div>

    if(process.browser && cookies.token){ //&& localStorage.getItem('master_key') != undefined){
        obj1 =
        <div className = { styles.navbarLinkRightContainer }>
            <h1 className = { styles.navbarLink } style = {{ color: linkCol }} onClick = { () => router.push('/user') }> 
                DASHBOARD
            </h1>
        </div>
        obj2 = null;
    }

    return (
        <div className = { styles.navbarBackground }>
            <div className = { styles.navbarLinkContainer }>
                <h1 className = { styles.navbarLink } style = {{ color: linkCol }}> 
                    <img src = '/favicon.ico' style = {{ transform: 'translate(0,-15px)', height: '60px' }} onClick = { () => router.push('/') } />
                </h1>
            </div>
            { obj1 }
            { obj2 }
        </div>
    );
}

export default Navbar;