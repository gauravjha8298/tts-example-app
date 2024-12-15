import React, { useState, useEffect } from "react";
import { ElevenLabs } from "elevenlabs"
import styles from "@/styles/CustomVoiceSelector.module.css";

interface VoiceSelectorProps {
  onSelect: (selectedVoice: ElevenLabs.Voice) => void;
}

const CustomVoiceSelector: React.FC<VoiceSelectorProps> = ({ onSelect }) => {
  const [voices, setVoices] = useState<ElevenLabs.Voice[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<ElevenLabs.Voice | null>(null);

  // Fetch voices from the API
  useEffect(() => {
    const fetchVoices = async () => {
      try {
        const response = await fetch("/api/getVoices");
        const data: {
          voices: ElevenLabs.Voice[]
        } = await response.json();

        setVoices(data.voices);
      } catch (error) {
        console.error("Error fetching voices:", error);
      }
    };
    fetchVoices();
  }, []);

  // Toggle dropdown visibility
  const toggleDropdown = () => setIsOpen((prev) => !prev);

  // Handle selection of a voice
  const handleSelect = (voice: ElevenLabs.Voice) => {
    setSelectedVoice(voice);
    onSelect(voice); // Pass selected voice to parent
    setIsOpen(false); // Close the dropdown
  };
  return (
    <div className={styles.dropdownContainer}>
      <div className={styles.dropdownHeader} onClick={toggleDropdown}>
        <span>{selectedVoice ? selectedVoice.name : "Select Voice"}</span>
        <i className={`${styles.arrow} ${isOpen ? styles.arrowUp : styles.arrowDown}`} />
      </div>
      {isOpen && (
        <div className={styles.dropdownList}>
          {voices.map((voice) => (
            <div
              key={voice.voice_id}
              className={styles.dropdownOption}
              onClick={() => handleSelect(voice)}
            >
              {/* <RandomSVG /> */}
              <span>{voice.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomVoiceSelector;
