import React, { useEffect, useState, useMemo } from 'react';
import jwt from 'jwt-decode';
import playImage from '../img/play.svg';
import pauseImage from '../img/pause.svg';
import stopImage from '../img/stop.svg';
import nextImage from '../img/next.svg';
import prevImage from '../img/prev.svg';
import replayImage from '../img/replay.svg';
import replayImage1 from '../img/replay1.svg';
import Header from '../components/Header';

function AudioPlayer(props) {
  const [audioFiles, setAudioFiles] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeAudio, setActiveAudio] = useState(null);
  const [isPaused, setPause] = useState(true);
  const [isReplay, setReplay] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [volume, setVolume] = useState(0.8); // Default volume level
  const { userId } = props;
  const token = localStorage.getItem('accessToken');
  const decodedtoken = jwt(token);

  useEffect(() => {
    fetchAudioFiles();
  }, []);

  useEffect(() => {
    if (activeAudio) {
      activeAudio.addEventListener('ended', handleEnded);
    }
  
    return () => {
      if (activeAudio) {
        activeAudio.removeEventListener('ended', handleEnded);
      }
    };
  }, [activeAudio, isReplay]);

  const formatTime = useMemo(() => {
    return (timeInSeconds) => {
      const minutes = Math.floor(timeInSeconds / 60);
      const seconds = Math.floor(timeInSeconds % 60);
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };
  }, []);

  const fetchAudioFiles = async () => {
    try {
      const response = await fetch(`https://localhost:7104/api/music/${userId ? userId : decodedtoken.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch audio files');
      }
      const data = await response.json();
      const Files = data.$values.map(item => item.music);
      setAudioFiles(Files);
    } catch (error) {
      console.error('Error fetching audio files:', error);
    }
  };

  const handleStart = async (path, index) => {
    try {
      const module = await import(`../music/${path}`);
      const audioFile = module.default;
      // Stop the currently playing audio if any
      if (activeAudio) {
        activeAudio.pause();
      }
      const audioElement = new Audio(audioFile);
      setActiveIndex(index);
      setActiveAudio(audioElement);

      audioElement.addEventListener('loadedmetadata', () => {
        setDuration(audioElement.duration);
      });

      // Update current time periodically
      audioElement.addEventListener('timeupdate', () => {
        if (!isSeeking) {
          setCurrentTime(audioElement.currentTime);
        }
      });

      // Set the initial volume
      audioElement.volume = volume;

      audioElement.play();
      setPause(false);
    } catch (error) {
      console.error('Error loading audio file:', error);
    }
  };

  const handlePlay = (index) => {
    if (activeAudio === null || activeIndex !== index) {
      handleStart(audioFiles[index].path, index);
    } else {
      activeAudio.pause();
      setPause(!isPaused);
      if (isPaused) {
        activeAudio.play();
        setPause(false);
      }
    }
  }


  const handleStop = () => {
    if (activeAudio) {
      activeAudio.pause();
      activeAudio.currentTime = 0;
      setPause(true);
      setActiveAudio(null);
    }
  };

  const handleReplay = () =>{
    setReplay(!isReplay);
  }

  const handleEnded = () => {
    if (isReplay) {
      handleStart(audioFiles[activeIndex].path, activeIndex);
    } else {
      handleNext();
    }
  };

  const handleNext = () => {
    handleStop();

  // Increment the active index
  let nextIndex = activeIndex + 1;

  // Check if the next index is within the audio files range
  if (nextIndex >= audioFiles.length) {
    nextIndex = 0; // Set the index to 0 to go back to the first audio file
  }

  const { path } = audioFiles[nextIndex];
  handleStart(path, nextIndex);
  };

  const handlePrev = () => {
    handleStop();

    // Increment the active index
    let nextIndex = activeIndex - 1;

    // Check if the next index is within the audio files range
    if (nextIndex < 0) {
      nextIndex = audioFiles.length - 1; // Set the index to 0 to go back to the first audio file
    }

    const { path } = audioFiles[nextIndex];
    handleStart(path, nextIndex);
  };

  const handleSeek = (event) => {
    const seekTime = parseFloat(event.target.value);
    setCurrentTime(seekTime);
    if (activeAudio) {
      activeAudio.currentTime = seekTime;
    }
  };

  const handleVolumeChange = (event) => {
    const volumeLevel = parseFloat(event.target.value);
    setVolume(volumeLevel);
    if (activeAudio) {
      activeAudio.volume = volumeLevel;
    }
  };

  const handleDelete = (id) =>{
    const userId = decodedtoken.id;
    const musicId = id;

    fetch(`https://localhost:7104/api/music/delete?userId=${userId}&musicId=${musicId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => {
        if (response.ok) {
          console.log('Music deleted successfully');
        } else {
          throw new Error('Failed to delete music');
        }
      })
      .catch((error) => {
        console.error('Error deleting music:', error);
      });
  }

  const handleAdd = (id) =>{
    if(!userId){
      return;
    }
    const musicId = id;

    fetch(`https://localhost:7104/api/music/addmusic?userId=${decodedtoken.id}&musicId=${musicId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => {
        if (response.ok) {
          console.log('Music added successfully');
        } else {
          throw new Error('Failed to add music');
        }
      })
      .catch((error) => {
        console.error('Error adding music:', error);
      });
  }

  return (
    <div>
    <Header/>
    <div className="audio-player">
      {audioFiles.length > 0 ? (
        <div>
          <div className="song-title">Song Title: {audioFiles[activeIndex].title}</div>
          <div className="current-time">Current Time: {formatTime(currentTime)}</div>
          <div className="duration">Duration: {formatTime(duration)}</div>
          <input
            className="seek-bar"
            type="range"
            min={0}
            max={duration}
            value={currentTime}
            step={0.1}
            onChange={handleSeek}
            onMouseDown={() => setIsSeeking(true)}
            onMouseUp={() => setIsSeeking(false)}
          />
          <div className="volume-bar">
            <label htmlFor="volume">Volume:</label>
            <input
              id="volume"
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={handleVolumeChange}
            />
          </div>
          <div className="controls">
            <div className="control-button" onClick={handleStop}>
              <img className="control-button-img" src={stopImage} alt="Stop" />
            </div>
            <div className="control-button" onClick={() => handlePlay(activeIndex)}>
              {isPaused ? 
              <img className="control-button-img" src={playImage} alt="Play" /> : 
              <img className="control-button-img" src={pauseImage} alt="Pause" />}
            </div>
            <div className="control-button" onClick={handlePrev}>
              <img className="control-button-img" src={prevImage} alt="Prev" />
            </div>
            <div className="control-button" onClick={handleNext}>
              <img className="control-button-img" src={nextImage} alt="Next" />
            </div>
            <div className="control-button" onClick={handleReplay}>
              <img className="control-button-img" src={!isReplay ? replayImage : replayImage1} alt="Next" />
            </div>
          </div>
          {audioFiles.map((audio, index) => (
            <div key={index} className={`small-audio-player ${activeIndex === index ? 'active' : ''}`}>
              <div className="play-title-warp">
              <div className="control-button" onClick={() => handlePlay(index)}>
                {activeIndex === index && !isPaused ? 
                <img className="control-button-img" src={pauseImage} alt="Pause" /> : 
                <img className="control-button-img" src={playImage} alt="Play" />}
              </div>
              <div className="song-title-small">{audio.title}</div> 
              </div>
              <div>
                {!userId ? <></> : <button className="add-button" onClick={() => handleAdd(audio.id)}>
                  Add 
                </button>}
                <button className="delete-button" onClick={() => handleDelete(audio.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
    </div>
  );
}

export default AudioPlayer;
