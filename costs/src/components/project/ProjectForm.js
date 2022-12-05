function ProjectForm() {
    return (
        <form>
            <div>
                <input type="text" placeholder="Insira o nome do projeto" />
            </div>
            <div>
                <input type="text" placeholder="Insira o orçamento total" />
            </div>
            <div>
                <select name="categoryID">
                    <option disabled selected>Selecionne uma categoria</option>
                </select>
            </div>
            <div>
                <input type="submit" value="Criar Projeto"/>
            </div>
        </form>
    )
}

export default ProjectForm