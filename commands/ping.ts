import { type APIInteractionResponse } from 'discord.js';
import { createMessage } from '../utils/discord-api';

export async function ping(): Promise<APIInteractionResponse> {
  return createMessage('Pong!');
}
