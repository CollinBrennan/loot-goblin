import { CommandInteraction, Message, SlashCommandBuilder } from 'discord.js';
import { fetchFreeEpicGames } from '../api/epic';
import { createGameList } from '../components/game-list';

export const data = new SlashCommandBuilder()
  .setName('epic')
  .setDescription('Returns all free games from Epic Games');

export async function execute(interaction: CommandInteraction) {
  const epicGames = await fetchFreeEpicGames();
  const gameList = createGameList(epicGames);

  return interaction.reply(gameList);
}
