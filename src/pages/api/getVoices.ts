import { NextApiRequest, NextApiResponse } from 'next';
import TTSCLient from '@/lib/TTSClient';

const getVoices = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const response = await TTSCLient.getVoices()
    res.status(200).json(response);
  } catch (error: unknown) {
    if(error instanceof Error) res.status(500).json({ error: 'Failed to fetch voices' });
    else res.status(500).json({error: 'An Unknown error has occured while fetching voices'});
  }
};

export default getVoices;
