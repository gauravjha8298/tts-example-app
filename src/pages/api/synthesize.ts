import TTSCLient from '@/lib/TTSClient';
import { NextApiRequest, NextApiResponse } from 'next';

const synthesize = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });  // Allow only POST requests
  }
  
  const { text, voiceId } = req.body;
  try {
    if (!text || !voiceId) {
      return res.status(400).json({ error: 'Text and voiceId are required' });
    }

    const audioStream = await TTSCLient.synthesize({text, voiceId})

    // Set headers for audio streaming
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Transfer-Encoding', 'chunked'); // Stream in chunks

    // Pipe the audio stream to the response
    audioStream.pipe(res);
  } catch (error: unknown) {
    console.log(error);
    if(error instanceof Error) res.status(500).json({ error: 'Failed to convert text to speech' });
    else res.status(500).json({error: "An Unknown error has occured"});
  }
};

export default synthesize;
