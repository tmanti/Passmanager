import { useRouter } from 'next/router';

import { setCookie, parseCookies, destroyCookie } from 'nookies';

export default function clear(){
    const router = useRouter();
    const cookies = parseCookies();

    destroyCookie(null, "token");

    if(process.browser)
        router.push("/")

    return (
        <div>
            cookies clear
        </div>
    )
}