import {
  SlashCommandBuilder,
  type APIInteraction,
  type APIInteractionResponse,
} from 'discord.js';
import { ping } from './ping';
import { subscribe } from './subscribe';

type Command = (interaction: APIInteraction) => Promise<APIInteractionResponse>;

export const registeredCommands = [
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),
  new SlashCommandBuilder()
    .setName('subscribe')
    .setDescription(
      'Subscribes the current channel to Loot Goblin notifications.',
    ),
];

export const commands: Record<string, Command> = {
  ping,
  subscribe,
};
