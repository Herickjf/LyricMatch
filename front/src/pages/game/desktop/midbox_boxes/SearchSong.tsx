import { use, useEffect, useState } from "react"

import TextInput from "../../../../utils/TextInput"
import Button    from "../../../../utils/Button"
import { useSearchContext } from "../../../../utils/SearchContext"
import "../../../../css/game/desktop/midBox/searchSong.css"
import { useRoomContext } from "../../../../utils/RoomContext"

const back_url = "http://localhost:4000"

const SearchSong: React.FC = () => {
    const [artist_name,     setArtistName]  = useState<string>("");
    const [song_name,       setSongName]    = useState<string>("");
    const [word_to_guess,   setWord]        = useState<string>("WORD");
    const [timer,           setTimer]       = useState<number>(30);
    const [already_started, setAlreadyStarted] = useState<boolean>(false);

    const { setCount } = useSearchContext();
    const { room } = useRoomContext();
    
    useEffect(() => {
        if(room) {
            setWord(room?.currentWord);
        }
    }
    , [room])

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prevTimer) => {
                if (prevTimer <= 0) {
                    clearInterval(interval);
                    return 0;
                }
                return prevTimer - 1;
            });
        }, 1000);

        return () => clearInterval(interval); // Limpa o intervalo ao desmontar o componente
    }, []); // Apenas ao montar o componente

    function search_song(){
        fetch(`${back_url}/api-requests/search?artist=${artist_name}&track=${song_name}`)
        .then((response) => response.json())
        .then((data) => {
            setCount(data);
        })
    }

    return (
        <div id="search_song_box">
            <div id="search_song_word_box">{word_to_guess}</div>
            <div id="search_song_subtitle">Enter a song with with the word: {word_to_guess}</div>

            <div id="search_box">
                <div id="search_song_inputs_box">
                    <TextInput label="Artist:" setText={setArtistName} placeholder="Enter the name of the artist"/>
                    <TextInput label="Song:" setText={setSongName} placeholder="Enter the name of the song" enterFunc={search_song}/>
                </div>

                <div id="search_song_button">
                    <Button text="Search" func={search_song}/>
                </div>
            </div>

            <div id="search_song_timer_back">
                <div id="search_song_timer_icon"/>
                <div id="search_song_timer_bar" style={{width: `${100/30 * timer}%`}}/>
            </div>
        </div>
    )
}

export default SearchSong;