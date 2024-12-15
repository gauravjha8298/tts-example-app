'use client';
import { useState } from 'react';
import axios from 'axios';
import TextInput from '@/components/TextInput';
import PlayButton from '@/components/PlayButton';
import VoiceSelector from '@/components/VoiceSelector';
import { toast } from 'react-toastify';
import { MAX_TEXT_LENGTH } from '@/constants/tts-textarea.constants';
import HearingIcon from '@mui/icons-material/Hearing';
import HearingDisabledIcon from '@mui/icons-material/HearingDisabled';
import { findVoiceById } from "@/utils/index";

export default function Home() {
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [text, setText] = useState<string>(''); 
  const [hasUserEdited, setHasUserEdited] = useState<boolean>(false); 

  const [previewAudioContext, setPreviewAudioContext] = useState<AudioContext | null>(null);
  const [previewAudioBuffer, setPreviewAudioBuffer] = useState<AudioBuffer | null>(null);

  const showErrorToast = (msg: string) => {
    toast.error(msg, {
      position: "bottom-left"
    });
  };

  const handlePlay = async () => {
    if (!text) {
      showErrorToast("No voice selected");
      return;  // Ensure text is not empty before making API call
    }
    if(!selectedVoice){
      console.log();
      showErrorToast("No voice selected");
      return;  // Ensure selectedVoice is not empty before making API call
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

      // Handle Axios errors
      if (axios.isAxiosError(error)) {
        try {
          // Check if the response is JSON and parse it
          const contentType = error.response?.headers['content-type'];
          if (contentType?.includes('application/json')) {
            const errorMessage = JSON.parse(
              new TextDecoder().decode(error.response?.data)
            ).error;
            showErrorToast(errorMessage || 'An error occurred!');
          }
        } catch (parseError) {
          showErrorToast('An unexpected error occurred!');
          console.error('Error parsing error response:', parseError);
        }
      } else {
        console.error('Error streaming audio:', error);
        showErrorToast('Unexpected error occurred!');
      }
      
      setLoading(false);
    }
  };

  const handleStop = () => {
    if (audioContext && audioContext.state === 'running') {
      audioContext.close();
      setIsPlaying(false);
    }
  };

  const playVoicePreview = async () => {
    const audioUrl = findVoiceById(selectedVoice)?.preview_url;
    
    console.log(audioUrl)
    if(audioUrl){
      // Create a new AudioContext if it doesn't exist
      const context = new AudioContext();
      setPreviewAudioContext(context);
      // Fetch and decode the audio
      try {
        const response = await fetch(audioUrl);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = await context.decodeAudioData(arrayBuffer);
        setPreviewAudioBuffer(buffer);

        // Create a source node and connect it to the destination (speakers)
        const source = context.createBufferSource();
        source.buffer = buffer;
        source.connect(context.destination);

        // Play the audio
        source.start(0);
        // setIsPlaying(true);

        // Reset after playback ends
        source.onended = () => {
          //setIsPlaying(false);
        };
      } catch (error) {
        console.error("Error playing audio:", error);
      }
    }
  }

  const stopAudio = () => {
    if (previewAudioContext && previewAudioContext.state === "running") {
      previewAudioContext.close();
      setPreviewAudioBuffer(null);
      setPreviewAudioBuffer(null);
      setIsPlaying(false);
    }
  }; 

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">TTS App Assignment</h1>

      <div className="bg-white rounded w-full max-w-2xl p-6 flex flex-col rounded-2xl border shadow-md">

        <TextInput text={text} setText={setText} hasUserEdited={hasUserEdited} setHasUserEdited={setHasUserEdited}/>

        <div className="border-t order-2 flex items-center justify-between gap-12 p-2 shadow-t">
          <div className="flex items-center justify-between gap-2">
            <VoiceSelector selectedVoice={selectedVoice} setSelectedVoice={setSelectedVoice} /> 
            
            {
              /** Audio Preview toggle */
              (previewAudioContext && previewAudioContext.state === "running") 
              ? 
              <button className='mt-4' onClick={stopAudio}><HearingDisabledIcon/></button>
              :
              <button className='mt-4' onClick={playVoicePreview}><HearingIcon/></button>
            }
            
          </div>


          <div className="flex items-center ml-auto"> {/* This will push the PlayButton to the right */}
            <div className="flex items-center  mt-4 pr-4">  {/* Added padding-right here */}
              <div className='charCount' style={{fontSize: "smaller"}}>{text.length}/{MAX_TEXT_LENGTH}</div>
            </div>
            <PlayButton
              loading={loading}
              handlePlay={handlePlay}
              handleStop={handleStop}
              isPlaying={isPlaying}
            />
          </div>
        </div>


        {/* <div className="border-t order-2 flex items-center justify-between gap-12 p-2 shadow-t">
          <VoiceSelector selectedVoice={selectedVoice} setSelectedVoice={setSelectedVoice} />

          <div className="flex items-center gap-2 flex-grow">
            <div className='charCount'>{text.length}/{MAX_TEXT_LENGTH}</div>
          </div>

          <PlayButton
            loading={loading}
            handlePlay={handlePlay}
            handleStop={handleStop}
            isPlaying={isPlaying}
          />
        </div> */}
      </div>
    </div>
  );
}
