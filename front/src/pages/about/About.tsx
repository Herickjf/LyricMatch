import '../../css/initialpages/about.css'
import CreatorBox from './CreatorBox'

interface AboutProps {
    closeMenu: () => void;
}

const About: React.FC<AboutProps> = ({closeMenu}) => {
    return(
        <div id="about" onClick={closeMenu}>
            <div id="creators_box">
                <h1>Creators</h1>
                <CreatorBox name='Herick José' image='avatar44.png' instagram='herick_jf' github='Herickjf' linkedin='https://www.linkedin.com/in/herick-jos%C3%A9-de-freitas-99a1ba266/'/>
                <CreatorBox name='João Marcos' image='avatar26.png' instagram='j4marcosdev' github='j4marcos' linkedin='https://www.linkedin.com/in/j4marcos/'/>
                <CreatorBox name='Luis Reis' image='avatar38.png' instagram='luisgustavo824' github='LuisReis09' linkedin='https://www.linkedin.com/in/luis-reis-7b22a6330/'/>
                <CreatorBox name='Rafael França' image='avatar33.png' instagram='rafaelfrncs' github='rafaelfranca1' linkedin='https://www.linkedin.com/in/rafael-franca-ofc/'/>
                
            </div>

            <div id="about_text_box">
                <div id="about_text">
                    <div id="about_text_title" className='highlight'>Welcome to LyricMatch!</div>
                    
                    <div id="about_text_body">
                        <hr/>
                        <br/>
                            <span className="highlight">CONTACT: </span>If you're a company interested in partnering with us or purchasing the game, please get in touch.  
                            Also, if you have any questions, suggestions, or would like to support the project to help keep the game online, feel free to reach out at <span className="highlight">lyricmatch.contact@gmail.com</span>.
                        <br />
                        <br />
                        <span className="highlight">Special note</span>: We have no commercial interest in this site, and we do not charge for any of our services.
                        <br />
                        <br />
                        <span className="highlight">Disclaimer</span>: All images, lyrics, and music used in this game are the property of their respective owners. We do not claim ownership of any of these materials. The game is intended for educational and entertainment purposes only. If you have any concerns about copyright infringement, please contact us.
                        <br />
                        <br/>
                        <hr/>
                        <br />
                        We’re thrilled to have you here! LyricMatch was born from our love for music and the incredible way it connects people. Whether it’s an unforgettable melody or deeply resonating lyrics, music has the unique power to bring individuals and groups together. Our goal was to capture this feeling and turn it into a fun, interactive game.
                        <br />
                        <br />
                        We deeply believe in the importance of music in our lives—how often only a song can express what we feel, and how unique moments are marked and remembered by melodies that bring tears to our eyes, evoking the emotion only music can convey.
                        <br />
                        <br />
                        Our goal with LyricMatch is simple: to challenge your musical knowledge by giving you the opportunity to discover new songs and test your memory with old favorites. Whether you’re a casual listener or a die-hard fan, we’re confident you’ll love the thrill of recognizing songs from lyrics, melodies, and much more.
                        <br />
                        <br />
                        We’re a team of four Computer Science students from the Federal University of Paraíba (UFPB), and we created this project as part of our Computer Networks course, as well as a personal passion project.
                        <br />
                        <br />
                        As a team, we’re not just developers—we’re also gamers and music lovers who believe in the power of collaboration and creativity. Many of the friendships within our group have been built through online gaming and shared experiences, and this project is our way of giving back to those communities. We hope that, through playing, you’ll experience the same joy and connection that inspired us to create LyricMatch.
                        <br />
                        <br />
                        We’re grateful to have you with us on this journey and hope you enjoy the game as much as we enjoyed creating it!
                        <br />
                        <br />
                    </div>
                    <div id="about_text_ending">
                        <p className="highlight">Sincerely, </p>
                        <b>The LyricMatch Team!</b>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default About