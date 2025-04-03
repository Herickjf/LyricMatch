import { useRef, useState, useEffect } from 'react';

import { useAudioSelectedContext } from '../../../../utils/AudioSelectedContext';

import '../../../../css/game/desktop/midBox/songPlayer.css'

const SongPlayer: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { artist, song, cover, audio, correct } = useAudioSelectedContext();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const setAudioDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false); 


    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', setAudioDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', setAudioDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (time: number): string => {
    if (isNaN(time)) return '00:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <div id="songPlayer_box">
      <div id="song_info">
        <div id="song_cover" style={{ backgroundImage: `url(${cover})` }}></div>
        {/* <div id="song_cover" style={{ backgroundImage: `url(https://cdn-images.dzcdn.net/images/cover/6630083f454d48eadb6a9b53f035d734/1000x1000-000000-80-0-0.jpg)` }}></div> */}
        <div id="bottom_image_info">
          <div id="song_text">
            <div id="song_name">{song}</div>
            {/* <div id="song_name">Bad guy</div> */}
            <div id="artist_name">{artist}</div>
            {/* <div id="artist_name">Billie Eilish</div> */}
          </div>
          {/* <div id="is_correct" className={correct ? 'correct_answer' : 'wrong_answer'}></div> */}
          <div id="isCorrect_icon" style={{backgroundColor: correct ? "#46cf46": "#f04949"}}>
            <div id="is_correct" className={correct ? 'correct_answer' : 'wrong_answer'}></div>
          </div>
        </div>
      </div>

      <div id="song_player">
        <audio ref={audioRef} src={audio} id="song_audio" preload="metadata" />
        {/* <audio ref={audioRef} src="https://cdnt-preview.dzcdn.net/api/1/1/b/5/2/0/b528e07441caa4883c8d1c4b746bf47c.mp3?hdnea=exp=1743635402~acl=/api/1/1/b/5/2/0/b528e07441caa4883c8d1c4b746bf47c.mp3*~data=user_id=0,application_id=42~hmac=1dd3cd52bdf03510d89994a2f50819fb8b80e3f975eee901ba5655c26884ec0d" id="song_audio" preload="metadata" /> */}

        <div id="progress_bar">
            <input
                type="range"
                min="0"
                max={duration}
                value={currentTime}
                onChange={handleSeek}
                style={{ width: '100%' }}
            />
            <div id="song_time" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
            </div>

        </div>
        <div onClick={togglePlay} id="play_pause_button">
            <div className={isPlaying ? "pause_icon" : "play_icon"}></div>
        </div>
      </div>
    </div>
  );
};

export default SongPlayer;
