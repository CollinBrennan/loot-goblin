import { Client } from 'discord.js';
import { commands } from './commands';
import { config } from './config';
import { deployCommands } from './deploy-commands';

const client = new Client({
  intents: ['Guilds', 'GuildMessages', 'DirectMessages'],
});

client.once('ready', async () => {
  console.log('Discord bot is ready! 🤖');

  if (process.env.DEV_GUILD_ID) {
    await deployCommands({ guildId: process.env.DEV_GUILD_ID });
  }
});

client.on('guildCreate', async (guild) => {
  await deployCommands({ guildId: guild.id });
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) {
    return;
  }
  const { commandName } = interaction;
  if (commands[commandName as keyof typeof commands]) {
    commands[commandName as keyof typeof commands].execute(interaction);
  }
});

client.login(config.DISCORD_BOT_TOKEN);
