import { NextApiRequest, NextApiResponse } from 'next';
import pinataClient from '@pinata/sdk';
import { Metadata } from '../../config/interfaces/metadata.interface';
import { Readable } from 'stream';

const API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY;
const SECRET_API_KEY = process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY;
const pinata = pinataClient(API_KEY, SECRET_API_KEY);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.status(400).send({ message: 'Only POST requests allowed' });
    return;
  }
  try {
    const request = JSON.parse(req.body) as Metadata;
    const readable = Readable.from([request.image]);
    console.log('Pin File');
    const filePin = await pinata.pinFileToIPFS([request.image]);
    // console.log(readable);
    request.image = `ipfs://${filePin.IpfsHash}`;
    const jsonPin = await pinata.pinJSONToIPFS(request);
    console.log('Pin JSON');
    res.status(200).json(jsonPin);
  } catch (err) {
    console.log(err);
  }
};
