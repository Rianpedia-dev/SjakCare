import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

export const eleven = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY!,
});

export const ELEVENLABS_VOICE_ID = process.env.ELEVENLABS_VOICE_ID!;
