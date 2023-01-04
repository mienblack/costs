import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import styles from './Projects.module.css'

import Message from "../layout/Message"
import Container from '../layout/Container'
import LinkButton from '../layout/LinkButton'
import ProjectCard from '../project/ProjectCard'
import Loading from "../layout/Loading"

function Projects() {
    const [projects, setProjects] = useState([])
    const [showLoader, setShowLoader] = useState(false)
    const [projectMessage, setProjectMessage] = useState('')

    const location = useLocation()
    let message = ''
    if (location.state) {
        message = location.state.message
    }

    useEffect(() => {
        setTimeout(() => {
            fetch('http://localhost:5000/projects', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(res => res.json())
                .then(data => {
                    setProjects(data)
                    setShowLoader(true)
                })
                .catch(err => console.log(err))
        }, 300)
    }, [])

    function removeProject(id) {
        fetch(`http://localhost:5000/projects/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(() => {
                setProjects(projects.filter(project => project.id !== id))
                setProjectMessage('Projeto Removido com sucesso')
            })
            .catch(err => console.log(err))
    }

    return (
        <div className={styles.projectContainer}>
            <div className={styles.titleContainer}>
                <h1>Meus Projetos</h1>
                <LinkButton to='/newproject' text="Criar Projeto" />
            </div>
            {message && <Message type="sucess" msg={message} />}
            {projectMessage && <Message type="sucess" msg={projectMessage} />}
            <Container customClass='start'>
                {projects.length > 0 && projects.map(project => {
                    return (
                        <ProjectCard
                            name={project.name}
                            id={project.id}
                            budget={project.budget}
                            category={project.category.name}
                            key={project.id}
                            handleRemove={removeProject}
                        />
                    )
                })}
                {!showLoader && <Loading />}
                {showLoader && projects.length === 0 && (
                    <p>Não há projetos cadastrados!</p>
                )}
            </Container>
        </div>
    )
}

export default Projects