import styles from './Home.module.css'
import LinkButton from '../layout/LinkButton'
import saving from '../../img/saving.svg'

function Home() {
    return (
        <section className={styles.homeContainer}>
            <h1>
                Bem vindo ao <span>Costs</span>
            </h1>
            <p>Comece a gerenciar os seus projetos agora mesmo!</p>
            <LinkButton text="Criar Projeto" to="/newproject" />
            <img src={saving} alt="Costs" />
        </section>
    )
}

export default Home