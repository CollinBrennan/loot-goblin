import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { fetchFreePrimeGames } from '../api/prime';
import { createGameList } from '../components/game-list';

export const data = new SlashCommandBuilder()
  .setName('prime')
  .setDescription('Returns all free games from Prime Gaming');

export async function execute(interaction: CommandInteraction) {
  const games = await fetchFreePrimeGames();
  const gameList = createGameList(games);

  return interaction.reply(gameList);
}
