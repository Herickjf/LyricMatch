import React from "react";
import CreatorBox from '../about/CreatorBox'

interface AboutGameProps {
    closeMenu: () => void;
}

const AboutGame: React.FC<AboutGameProps> = ({closeMenu}) => {
    return (
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
                        <span className="highlight">Important! </span> <br/>
                        &emsp;We use a free <a className="highlight" href="https://www.deezer.com/" target="_blank">DEEZER</a> API plan to search for songs (including image, title, artist, audio preview, etc.). You can check these information on their website. We are grateful for their support and encourage users to visit their website.

                        <br/>
                        <br/>
                        <span className="highlight">Inspirations</span> <br/>
                        &emsp;The game is inspired by the "Song Association Game" segment on the Elle channel, where participants are given a specific word and must quickly recall a song containing that word in its lyrics. The gameplay is simple but requires a solid musical knowledge and quick thinking, as there’s little time to think and respond.
                        <br/>
                        <br/>
                        &emsp;Our goal with this game is to create a fun environment that not only tests musical knowledge but also sparks creativity. As the rounds progress, the tension rises with each word revealed, and laughter ensues from unexpected answers or desperate attempts to recall a song that fits. It’s a fun way to test memory and musical knowledge while enjoying moments of relaxation with friends.
                        <br/>
                        <br/>
                        <span className="highlight">How to Play</span><br/>
                        &emsp;1. Choose an avatar, enter your nickname, and join/create a room.
                        <br/>
                        <br/>
                        &emsp;2. Room Settings:
                        <br/>
                        &emsp;&emsp;Number of Players: Set the maximum number of players.
                        <br/>
                        &emsp;&emsp;Number of Rounds: Choose how many rounds to play.
                        <br/>
                        &emsp;&emsp;Language Selection: Choose the language of the words in the game (Portuguese, English, or Spanish).
                        <br/>
                        <br/>
                        &emsp;3. In the Waiting Room:
                        <br/>
                        &emsp;&emsp;Invited Players: Players will remain in the waiting room until the host starts the game.
                        <br/>
                        &emsp;&emsp;Host: The host controls when the game begins and gives the command to start.
                        <br/>
                        <br/>
                        &emsp;4. Starting the Game:
                        <br/>
                        &emsp;&emsp;Word of the Round: At the start of each round, a keyword will be presented, and the timer begins.
                        <br/>
                        &emsp;&emsp;Challenge: Players have 30 seconds to type the name of the artist and the title of the corresponding song by clicking "Search."
                        <br/>
                        &emsp;&emsp;Song Selection: After clicking "Search," up to five song options will be presented to each player. Select the song that matches the keyword.
                        <br/>
                        <br/>
                        &emsp;5. Round Results: At the end of the round, each player’s attempts will be displayed, indicating whether their choices were correct or not. Players can listen to a preview of the song and view additional information.
                        <br/>
                        <br/>
                        &emsp;6. Final Ranking: After all rounds, the scores will be displayed in an ordered ranking. <br/><br/>
                        Good luck and have fun playing!
                        <br/><br/>
                    </div>
                    <div id="about_text_ending">
                        <p className="highlight">Sincerely, </p>
                        <b className="hightlight">The LyricMatch Team!</b>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AboutGame;