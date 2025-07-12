import {
  type APIApplicationCommandInteractionDataStringOption,
  type APIChatInputApplicationCommandInteraction,
  type APIInteractionResponse,
  type APIWebhook,
} from 'discord.js';
import { DISCORD_API_URL } from '../constants';
import { putWebhook } from '../db/webhook';
import { createMessage } from '../utils/discord-api';

export async function subscribe(
  interaction: APIChatInputApplicationCommandInteraction,
): Promise<APIInteractionResponse> {
  const discordBotToken = process.env.DISCORD_BOT_TOKEN;
  if (!discordBotToken) throw new Error('Missing DISCORD_BOT_TOKEN');

  const channelId = interaction.channel?.id;
  if (!channelId) throw new Error('Missing channel id');

  const options = interaction.data.options;
  const service = options?.find(
    (option): option is APIApplicationCommandInteractionDataStringOption =>
      option.name === 'service',
  );
  if (!service) throw new Error('Missing service parameter');

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
        name: `Loot Goblin Notifications - ${service.value}`,
        avatar: null,
      }),
    },
  );

  if (!response.ok) {
    console.error(response);
    return createMessage('Failed to subscribe.');
  }

  const webhook = (await response.json()) as APIWebhook;

  // Don't await db insert to avoid Discord timeout
  putWebhook({
    webhookId: webhook.id,
    serviceId: service.value,
    url: webhook.url || '',
  });

  return createMessage('Successfully subscribed!');
}
