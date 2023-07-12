import React, { useEffect, useState } from 'react';
import jwt from 'jwt-decode';

function formatTime(timeInSeconds) {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function AudioPlayer() {
  const [audioFiles, setAudioFiles] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeAudio, setActiveAudio] = useState(null);
  const [isPaused, setPause] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [volume, setVolume] = useState(0.5); // Default volume level
  const token = localStorage.getItem('accessToken');
  const decodedtoken = jwt(token);

  useEffect(() => {
    fetchAudioFiles();
  }, []);

  useEffect(() => {
    if (activeAudio) {
      activeAudio.addEventListener('ended', handleNext);
    }

    return () => {
      if (activeAudio) {
        activeAudio.removeEventListener('ended', handleNext);
      }
    };
  }, [activeAudio]);

  const fetchAudioFiles = async () => {
    try {
      const response = await fetch(`https://localhost:7104/api/music/${decodedtoken.id}`);
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

  const handlePlay = () => {
    if (activeAudio == null) {
      handleStart(audioFiles[activeIndex].path, activeIndex);
    } else {
      activeAudio.pause();
      setPause(!isPaused);
      if (isPaused) {
        activeAudio.play();
        setPause(false);
      }
    }
  };

  const handleStop = () => {
    if (activeAudio) {
      activeAudio.pause();
      activeAudio.currentTime = 0;
      setPause(true);
      setActiveAudio(null);
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

  const handleAudioClick = (index) => {
    if (index !== activeIndex) {
      const { path } = audioFiles[index];
      handleStart(path, index);
    }
  };

  return (
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
            <button className="control-button" onClick={handleStop}>
              Stop
            </button>
            {isPaused ? (
              <button className="control-button" onClick={handlePlay}>
                Play
              </button>
            ) : (
              <button className="control-button" onClick={handlePlay}>
                Pause
              </button>
            )}
            <button className="control-button" onClick={handlePrev}>
              Prev
            </button>
            <button className="control-button" onClick={handleNext}>
              Next
            </button>
          </div>
          <div className="audio-list">
            <h3>Audio Files:</h3>
            <ul>
              {audioFiles.map((file, index) => (
                <li
                  key={file.id}
                  onClick={() => handleAudioClick(index)}
                  className={index === activeIndex ? 'active' : ''}
                >
                  {file.title}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}

export default AudioPlayer;
