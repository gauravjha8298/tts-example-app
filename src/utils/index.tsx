import { getItemWithExpiration } from "@/lib/LocalStorageWithExpiration";
import { ElevenLabs } from "elevenlabs";

export const findVoiceById = (targetVoiceId: string): ElevenLabs.Voice | undefined => {
    const voices = (getItemWithExpiration("voices") as ElevenLabs.Voice[]);
    return voices.find((voice) => voice.voice_id === targetVoiceId);
  }