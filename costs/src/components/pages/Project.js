import styles from './Project.module.css'

import Loading from '../layout/Loading'
import Container from '../layout/Container'
import ProjectForm from '../project/ProjectForm'
import Message from '../layout/Message'
import ServiceCard from '../service/ServiceCard'
import ServiceForm from '../service/ServiceForm'

import { v4 as uuidv4 } from 'uuid'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'

function Project() {
    const { id } = useParams()
    const [project, setProject] = useState([])
    const [showProjectForm, setShowProjectForm] = useState(false)
    const [services, setServices] = useState([])
    const [showServiceForm, setShowServiceForm] = useState(false)
    const [message, setMessage] = useState()
    const [messageType, setMessageType] = useState()

    useEffect(() => {
        setTimeout(() => {
            fetch(`http://localhost:5000/projects/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(res => res.json())
                .then(data => {
                    setProject(data)
                    setServices(data.services)
                })
                .catch(err => console.log(err))
        }, 1000)
    }, [id])

    function toggleProjectForm() {
        setShowProjectForm(!showProjectForm)
    }

    function editPost(project) {
        setMessage('')

        if (project.budget < project.cost) {
            setMessageType('error')
            setMessage('O orçamento não pode ser MENOR que o custo total do projeto!')
            return false
        }

        fetch(`http://localhost:5000/projects/${project.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(project)
        })
            .then(res => res.json())
            .then(data => {
                setProject(data)
                setShowProjectForm(false)
                setMessageType('success')
                setMessage('Projeto Atualizado!')
            })
            .catch(err => console.log(err))
    }

    function toggleServiceForm() {
        setShowServiceForm(!showServiceForm)
    }

    function createService(project) {
        const lastService = project.services[project.services.length - 1]
        lastService.id = uuidv4()

        const lastServiceCost = lastService.cost

        const newCost = parseFloat(project.cost) + parseFloat(lastServiceCost)

        //Validação caso o custo total seja ultrapassado
        if (newCost > parseFloat(project.budget)) {
            setMessage('Orçamento ultrapassado, verifique o valor do serviço')
            setMessageType('error')
            project.services.pop()
            return false
        }
        project.cost = newCost

        fetch(`http://localhost:5000/projects/${project.id}`, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(project)
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                setServices(data.services)
                setShowServiceForm(!showServiceForm)
                setMessage('Serviço Adicionado')
                setMessageType('success')
            })
            .catch(err => console.log(err))
    }

    function removeService(id, cost) {
        const serviceUpdated = project.services.filter(service => {
            return service.id !== id
        })
        const projectUpdated = project

        projectUpdated.services = serviceUpdated
        projectUpdated.cost = parseFloat(projectUpdated.cost) - parseFloat(cost)

        fetch(`http://localhost:5000/projects/${projectUpdated.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(projectUpdated)
        })
            .then(res => res.json())
            .then(data => {
                setProject(projectUpdated)
                setServices(serviceUpdated)
                setMessageType('success')
                setMessage('Serviço removido com sucesso!')
            })
            .catch(err => console.log(err))
    }

    return (
        <>
            {project.name
                ? (
                    <div className={styles.projectDetails}>
                        <Container customClass="column">
                            {message && <Message type={messageType} msg={message} />}
                            <div className={styles.detailsContainer}>
                                <h1>Projeto: {project.name}</h1>
                                <button onClick={toggleProjectForm} className={styles.btn}>
                                    {!showProjectForm ? "Editar Projeto" : "Fechar"}
                                </button>
                                {!showProjectForm ? (
                                    <div className={styles.projectInfo}>
                                        <p>
                                            <span>Categoria: </span>{project.category.name}
                                        </p>
                                        <p>
                                            <span>Orçamento: </span>R${project.budget}
                                        </p>
                                        <p>
                                            <span>Total Utilizado: </span>R${project.cost}
                                        </p>
                                    </div>
                                ) : (
                                    <div className={styles.projectInfo}>
                                        <ProjectForm
                                            handleSubmit={editPost}
                                            btnText='Concluir Edição'
                                            projectData={project}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className={styles.serviceFormContainer}>
                                <h2>Adicione um serviço:</h2>
                                <button className={styles.btn} onClick={toggleServiceForm} >
                                    {!showServiceForm ? 'Adicionar Seviço' : 'Fechar'}
                                </button>
                                <div className={styles.projectInfo}>
                                    {showServiceForm &&
                                        <ServiceForm
                                            btnText="Adicionar serviço"
                                            handleSubmit={createService}
                                            projectData={project}
                                        />
                                    }
                                </div>
                            </div>
                            <h2>Serviços:</h2>
                            <Container customClass='start'>
                                {services.length > 0 && (
                                    services.map((service) => (
                                        <ServiceCard
                                            id={service.id}
                                            name={service.name}
                                            description={service.description}
                                            cost={service.cost}
                                            key={service.id}
                                            handleRemove={removeService}
                                        />
                                    )
                                    )
                                )}
                                {services.length === 0 && (
                                    <p>Não há serviços cadastrados</p>
                                )}
                            </Container>
                        </Container>
                    </div>
                )
                : <Loading />}
        </>
    )
}

export default Project