import { use, useState } from "react"

import TextInput from "../../../../utils/TextInput"
import Button    from "../../../../utils/Button"
import { useSearchContext } from "../../../../utils/SearchContext"
import "../../../../css/game/desktop/midBox/searchSong.css"

const back_url = "http://localhost:4000"

const SearchSong: React.FC = () => {
    const [artist_name,     setArtistName]  = useState<string>("");
    const [song_name,       setSongName]    = useState<string>("");
    const [word_to_guess,   setWord]        = useState<string>("WORD");

    const { setCount } = useSearchContext();

    function search_song(){
        fetch(`${back_url}/api-requests/search?artist=${artist_name}&track=${song_name}`)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            setCount(data);
        })
    }

    return (
        <div id="search_song_box">
            <div id="search_song_word_box">{word_to_guess}</div>
            <div id="search_song_subtitle">Enter a song with with the word: {word_to_guess}</div>

            {/* <div id="spinning_logo"></div> */}

            <div id="search_song_inputs_box">
                <TextInput label="Artist:" setText={setArtistName} placeholder="Enter the name of the artist"/>
                <TextInput label="Song:" setText={setSongName} placeholder="Enter the name of the song"/>
            </div>

            <div id="search_song_button">
                <Button text="Search" func={search_song}/>
            </div>

            <div id="search_song_timer_back">
                <div id="search_song_timer_icon"/>
                <div id="search_song_timer_bar"/>
            </div>
        </div>
    )
}

export default SearchSong;