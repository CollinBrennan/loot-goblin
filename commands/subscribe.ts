import {
  Webhook,
  type APIInteraction,
  type APIInteractionResponse,
  type APIWebhook,
} from 'discord.js';
import { DISCORD_API_URL } from '../constants';
import { putWebhook } from '../db/webhook';
import { epic } from '../services';
import { createMessage } from '../utils/discord-api';

export async function subscribe(
  interaction: APIInteraction,
): Promise<APIInteractionResponse> {
  const discordBotToken = process.env.DISCORD_BOT_TOKEN;
  if (!discordBotToken) throw new Error('Missing DISCORD_BOT_TOKEN');

  const channelId = interaction.channel?.id;
  if (!channelId) throw new Error('Missing channel id');

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

  if (!response.ok) {
    console.error(response);
    return createMessage('Failed to subscribe.');
  }

  const webhook = (await response.json()) as APIWebhook;

  // Add webhook to db
  putWebhook({
    webhookId: webhook.id,
    serviceId: epic.id,
    url: webhook.url || '',
  });

  return createMessage('Successfully subscribed!');
}
