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

    // Restrict to 500 characters
    if (newText.length <= 500) {
      setText(newText); // Propagate changes to parent state
      setHasUserEdited(true);
    }
  };

  // Handle paste events to trim text to 500 characters
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const paste = e.clipboardData.getData('text');
    const maxLength = 500;
    const totalText = text + paste;  // Combine existing text and pasted text

    // Trim the combined text to 500 characters
    const trimmedText = totalText.length > maxLength ? totalText.substring(0, maxLength) : totalText;

    // Prevent the default paste behavior and insert the trimmed text
    e.preventDefault();
    setText(trimmedText);
    setHasUserEdited(true);
  };

  return (
    <textarea
      id="tts-text-area"
      className="w-full h-[300px] resize-none p-2 border rounded border-none focus:outline-none focus:ring-0"
      placeholder="Enter text here..."
      value={text}
      onChange={handleChange}
      onPaste={handlePaste}
    ></textarea>
  );
};

export default TextInput;
