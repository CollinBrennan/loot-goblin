import {
  InteractionResponseType,
  type APIInteractionResponse,
} from 'discord.js';

export function createMessage(message: string): APIInteractionResponse {
  return {
    type: InteractionResponseType.ChannelMessageWithSource,
    data: { content: message },
  };
}
