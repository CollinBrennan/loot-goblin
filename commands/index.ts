import {
  SlashCommandBuilder,
  type APIInteraction,
  type APIInteractionResponse,
} from 'discord.js';
import { epic, prime } from '../services';
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
    )
    .addStringOption((option) =>
      option
        .setName('service')
        .setDescription('The service to subscribe to (e.g. epic, prime)')
        .setRequired(true)
        .addChoices(
          { name: epic.name, value: epic.id },
          { name: prime.name, value: prime.id },
        ),
    ),
];

export const commands: Record<string, Command> = {
  ping,
  subscribe,
};
