import {
  InteractionResponseType,
  type APIInteraction,
  type APIInteractionResponse,
} from 'discord.js';
import { DISCORD_API_URL } from '../constants';
import { createMessage } from '../utils/discord-api';

export async function subscribe(
  interaction: APIInteraction,
): Promise<APIInteractionResponse> {
  const discordBotToken = process.env.DISCORD_BOT_TOKEN;

  if (!discordBotToken) throw new Error('Discord bot token is undefined.');

  const channelId = interaction.channel?.id;

  if (!channelId) return createMessage('Invalid channel id.');

  // Create webhook in the current channel
  const response = await fetch(
    `${DISCORD_API_URL}/channels/${channelId}/webhooks`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bot ${discordBotToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Loot Goblin',
        avatar: null,
      }),
    },
  );

  if (!response.ok) return createMessage('Failed to subscribe.');

  return createMessage('Successfully subscribed!');
}
