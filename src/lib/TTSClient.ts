import { ElevenLabsClient } from 'elevenlabs';
import { Readable } from 'stream';

class TTSClient {
  private client: ElevenLabsClient;

  constructor(apiKey: string) {
    this.client = new ElevenLabsClient({apiKey});
  }

  // Get all available voices
  async getVoices() {
    try {
      const voices = await  this.client.voices.getAll();
      return voices;
    } catch (error: unknown) {
        if(error instanceof Error) throw new Error('Failed to fetch voices: ' + error.message);
        else throw new Error("An unknown error has occured");
    }
  }

  // Synthesize text to speech and return audio stream
  async synthesize({ text, voiceId }: { text: string; voiceId: string }): Promise<Readable> {
    try {
      const audioStream = await this.client.generate({
        stream: true,
        voice: voiceId,
        text: text
      });
      return audioStream;
    } catch (error: unknown) {
      if (error instanceof Error) throw new Error('Failed to synthesize speech: ' + error.message);
      else throw new Error("An unknown error has occurred");
    }
  }
}
const TTS_Client = new TTSClient(process.env.ELEVENLABS_API_KEY!);

export default TTS_Client;
