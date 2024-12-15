'use client';
import { useState } from 'react';
import axios from 'axios';
import TextInput from '@/components/TextInput';
import PlayButton from '@/components/PlayButton';
import VoiceSelector from '@/components/VoiceSelector';

export default function Home() {
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [text, setText] = useState<string>(''); 
  const [hasUserEdited, setHasUserEdited] = useState<boolean>(false); 
  

  const handlePlay = async () => {
    if (!text) {
      console.log("Text is empty!");
      return;  // Ensure text is not empty before making API call
    }
    setLoading(true);
    try {
      const response = await axios.post('/api/synthesize', {
        text,
        voiceId: selectedVoice,
      }, { responseType: 'arraybuffer' });
      const arrayBuffer = response.data;  // This will be the raw audio data (binary)

      // Create an AudioContext to decode and play the audio
      const context = new AudioContext();
      setAudioContext(context);

      // Decode the audio buffer from the arrayBuffer
      const audioBuffer = await context.decodeAudioData(arrayBuffer);

      // Create a buffer source node and connect it to the destination (speakers)
      const source = context.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(context.destination);
      source.start(0);

      setIsPlaying(true);

      // When the audio finishes, stop playing
      source.onended = () => {
        setIsPlaying(false);
      };

      setLoading(false);
    } catch (error) {
      console.error('Error streaming audio:', error);
      setLoading(false);
    }
  };

  const handleStop = () => {
    if (audioContext && audioContext.state === 'running') {
      audioContext.close();
      setIsPlaying(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">TTS App Assignment</h1>

      <div className="bg-white rounded w-full max-w-2xl p-6 flex flex-col rounded-2xl border shadow-md">

        <TextInput text={text} setText={setText} hasUserEdited={hasUserEdited} setHasUserEdited={setHasUserEdited}/>

        <div className="border-t order-2 flex items-center justify-between gap-12 p-2 shadow-t">
          <VoiceSelector selectedVoice={selectedVoice} setSelectedVoice={setSelectedVoice} />
          <PlayButton
            loading={loading}
            handlePlay={handlePlay}
            handleStop={handleStop}
            isPlaying={isPlaying}
          />
        </div>
      </div>
    </div>
  );
}
