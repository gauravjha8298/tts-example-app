import React, { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { ElevenLabs } from "elevenlabs";
import axios from 'axios';
import { getItemWithExpiration, setItemWithExpiration } from '@/lib/LocalStorageWithExpiration';

type VoiceSelectorProps = {
  selectedVoice: string;
  setSelectedVoice: (value: string) => void;
};

const VoiceSelector: React.FC<VoiceSelectorProps> = ({ selectedVoice, setSelectedVoice }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [voices, setVoices] = useState<ElevenLabs.Voice[]>([]);

  // Fetch voices from the API
  useEffect(() => {

    async function fetchVoices() {
      try {
        const response = await axios.get('/api/getVoices');
        setLoading(false);
        setError(null); 

        // If there are no voices, set the state as empty array
        if (response.data.voices.length > 0) {
          setItemWithExpiration("voices", response.data.voices);
          setVoices(response.data.voices);
          setSelectedVoice(response.data.voices[0].voice_id); // Select first voice by default
        } else {
          setError('No voices available.');
        }
      } catch (error) {
        setLoading(false);
        setError('Failed to fetch voices.');
        console.error(error);
      }
    }

    const voices = getItemWithExpiration("voices");
    if(!voices) fetchVoices();
    else {
      setVoices(voices);
      setSelectedVoice(voices[0].voice_id); // Select first voice by default
      setLoading(false);
      setError(null); 
    }
  }, [setSelectedVoice]);

  return (
    <div className="mt-4 relative VoiceSelectorBlock">
      {error && <div className="text-red-500">{error}</div>}

      <select
        className="block w-full rounded-full border border-gray-300 py-2 pl-5 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
        value={selectedVoice}
        onChange={(e) => setSelectedVoice(e.target.value)}
        disabled={loading} // Disable dropdown while loading
      >
        {loading ? (
          <option disabled>Loading...</option>
        ) : (
          voices.map((voice) => (
            <option key={voice.voice_id} value={voice.voice_id}>
              {voice.name ?? `Voice ${voice.voice_id}`}
            </option>
          ))
        )}
      </select>

      {/* Spinner over the select box */}
      {loading && (
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <CircularProgress size={24} style={{ color: 'gray' }} />
        </div>
      )}

      {/* Dropdown arrow */}
      <svg
        className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M19 9l-7 7-7-7"
        ></path>
      </svg>
    </div>
  );
};

export default VoiceSelector;
