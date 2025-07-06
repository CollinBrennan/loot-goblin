import type { APIGatewayProxyEvent } from 'aws-lambda';
import { verifyKey } from 'discord-interactions';
import {
  InteractionResponseType,
  InteractionType,
  type APIInteraction,
  type APIInteractionResponse,
} from 'discord.js';
import { responses } from '../commands';

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIInteractionResponse | undefined> => {
  const publicKey = process.env.DISCORD_CLIENT_PUBLIC_KEY;

  if (!publicKey) {
    throw new Error('Missing Discord public key');
  }

  // API Gateway has lowercase headers
  const signature = event.headers['x-signature-ed25519'];
  const timestamp = event.headers['x-signature-timestamp'];
  const body = event.body;

  if (!signature || !timestamp || !body) {
    console.error('Missing headers or body');
    return;
  }

  const isValidRequest = await verifyKey(body, signature, timestamp, publicKey);

  if (!isValidRequest) {
    console.error('Bad request signature');
    return;
  }

  const interaction = JSON.parse(body) as APIInteraction;
  console.log(interaction);

  // Handle ping interaction when setting interaction url
  if (interaction.type === InteractionType.Ping) {
    return { type: InteractionResponseType.Pong };
  }

  // Handle slash commands
  if (interaction.type === InteractionType.ApplicationCommand) {
    const response = responses[interaction.data.name];

    if (!response) console.error('Invalid slash command');

    return response;
  }
};
