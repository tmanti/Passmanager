import Header from '../components/Header'
import Navbar from '../components/Navbar'

import styles from '../styles/Home.module.css'


export default function Home() {//create navbar
  return (
    <div className={styles.container}>
      <Header title="Home"/>
      <Navbar linkCol="black"/>
      <main className={styles.main}>
        <h1>Consider your password managed :sunglas:</h1>
      </main>
    </div>
  )
}
