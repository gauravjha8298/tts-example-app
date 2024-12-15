import React, { useEffect } from 'react';

type TextInputProps = {
  text: string;
  setText: (value: string) => void; 

  hasUserEdited: boolean;
  setHasUserEdited: (value: boolean) => void;
};

const TextInput: React.FC<TextInputProps> = ({ text, setText, hasUserEdited, setHasUserEdited}) => {
  // If text is empty, set to default text
  useEffect(() => {
    if (!text && !hasUserEdited) {
      setText("The ElevenLabs voice generator can deliver high-quality, human-like speech in 32 languages. Perfect for audiobooks, video voiceovers, commercials, and more.");  // Set the default text if text is empty
      setHasUserEdited(true);
    }
  }, [text, setText, hasUserEdited, setHasUserEdited]);

  // Handle text changes
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);  // Propagate changes to parent state
    setHasUserEdited(true);
  };

  return (
    <textarea
      id="tts-text-area"
      className="w-full h-[300px] resize-none p-2 border rounded border-none focus:outline-none focus:ring-0"
      placeholder="Enter text here..."
      value={text}
      onChange={handleChange}
    ></textarea>
  );
};

export default TextInput;
