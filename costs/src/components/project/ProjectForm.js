import { useEffect, useState } from "react";
import Input from "../form/Input";
import Select from "../form/Select";
import SubmitButton from "../form/SubmitButton";
import styles from "./ProjectForm.module.css";

function ProjectForm({ btnText, handleSubmit, projectData }) {
    const [categories, setCategories] = useState([]);
    const [project, setProject] = useState(projectData || {});

    useEffect(() => {
        fetch("http://localhost:5000/categories", {
            method: "GET",
            headers: {
                "Content-type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setCategories(data);
            })
            .catch((err) => console.log(err))
    }, []);

    const submit = (e) => {
        e.preventDefault();
        handleSubmit(project);
    };

    function handleChange(e) {
        setProject({ ...project, [e.target.name]: e.target.value });
    }

    function handleSelect(e) {
        setProject({
            ...project,
            category: {
                id: e.target.value,
                name: e.target.options[e.target.selectedIndex].text
            }
        });
    }

    return (
        <form className={styles.form} onSubmit={submit}>
            <Input
                type="text"
                text="Nome do Projeto"
                placeholder="Insira o nome do projeto"
                name="name"
                value={project.name ? project.name : ''}
                handleChange={handleChange}
            />
            <Input
                type="number"
                text="Orçamento do Projeto"
                placeholder="Insira o orçamento total"
                name="budget"
                value={project.budget ? project.budget : ''}
                handleChange={handleChange}
            />
            <Select
                name="categoryID"
                text="Selecione a categoria "
                options={categories}
                handleChange={handleSelect}
                value={project.category ? project.category.id : ''}
            />
            <SubmitButton text={btnText} />
        </form>
    );
}

export default ProjectForm;
