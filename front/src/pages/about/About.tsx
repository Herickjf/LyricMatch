import '../../css/initialpages/about.css'
// import CreatorBox from '../../utils/CreatorBox'

const About = () => {
    return(
        <div id="about">
            <div id="creators_box">
                {/*
                    Aqui devera ser feito uma consulta a API, pegando as imagens e as informacoes dos criadores
                    Feito isso, usar o elemento CreatorBox que ja espera pelos seguintes campos:
                        - nome do criador
                        - imagem do criador
                        - subtitulo do criador (isto e, a funcao desempenhada por tal)
                        - linkedin_link do criador
                        - github_link do criador
                */}
            </div>

            <div id="about_text">
                <div id="about_text_title">Welcome to Song Guesser!</div>
                <div id="about_text_body"/> {/* Pegar o texto da api? */}
                <div id="about_text_ending">
                    <p>Sincerely, </p>
                    <b>The Song Guesser Team!</b>
                </div>
            </div>
        </div>

    )
}

export default About