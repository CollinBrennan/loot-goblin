import {
  InteractionResponseType,
  SlashCommandBuilder,
  type APIInteractionResponse,
} from 'discord.js';

export const commands = [
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),
  new SlashCommandBuilder()
    .setName('another-command')
    .setDescription('Some other command!'),
  new SlashCommandBuilder()
    .setName('invalid')
    .setDescription('Testing invalid commands'),
];

export const responses: Record<string, APIInteractionResponse> = {
  ping: {
    type: InteractionResponseType.ChannelMessageWithSource,
    data: { content: 'Pong!' },
  },
  'another-command': {
    type: InteractionResponseType.ChannelMessageWithSource,
    data: { content: 'I am another command!' },
  },
};
