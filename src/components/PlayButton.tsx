import React from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import CircularProgress from '@mui/material/CircularProgress';

type PlayButtonProps = {
  loading: boolean;
  handlePlay: () => void;
  handleStop: () => void;
  isPlaying: boolean;
};

const PlayButton: React.FC<PlayButtonProps> = ({ loading, handlePlay, handleStop, isPlaying }) => (
  <button
    id="synthesizeTTSBtn"
    className="w-10 h-10 bg-black text-white rounded-full hover:bg-gray-800 disabled:bg-black flex items-center justify-center mt-4"
    onClick={isPlaying ? handleStop : handlePlay}
    disabled={loading}
  >
    {loading ? (
      <CircularProgress size={24} style={{color: 'white'}} />
    ) : isPlaying ? (
      <StopIcon />
    ) : (
      <PlayArrowIcon />
    )}
  </button>
);

export default PlayButton;
