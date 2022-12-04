import { Link } from 'react-router-dom'
import { FaInstagram, FaLinkedin, FaGithub } from 'react-icons/fa'
import styles from './Footer.module.css'

function Footer() {
    return (
        <footer className={styles.footer}>
            
            <ul className={styles.socialList}>
                <li>
                    <Link>
                        <FaInstagram />
                    </Link>
                </li>
                <li>
                    <Link>
                        <FaLinkedin />
                    </Link>
                </li>
                <li>
                    <Link>
                        <FaGithub />
                    </Link>
                </li>
            </ul>
            <div className={styles.ref}>
                <p>Made with 💟 by Damien Costa ✌🏿</p>
                <p>
                    <span className={styles.refSpan}>Costs</span> &copy; 2022
                </p>
            </div>
        </footer>
    )
}

export default Footer