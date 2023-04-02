require('dotenv').config(); // LOAD CONFIG (.env)
const { Client, GatewayIntentBits, Partials } = require('discord.js');
import BaseClient from './baseClass/BaseClient.class';
import GameModule from './modules/Game.module';

const config ={
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildModeration,
		GatewayIntentBits.GuildEmojisAndStickers,
		GatewayIntentBits.GuildWebhooks,
		GatewayIntentBits.GuildInvites,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.AutoModerationExecution,
	],
	partials: [
		Partials.Channel, 
		Partials.GuildMember,
		Partials.Message, 
		Partials.User,
		Partials.Reaction
	],
	allowedMentions: { parse: ['users', 'roles', 'everyone'], repliedUser: true },
}

async function main() {
	console.log('Starting bot...');
	if (!process.env.DISCORD_BOT_TOKEN) throw new Error('DISCORD_BOT_TOKEN is not defined in .env');
	const baseClient = new BaseClient(config, process.env.DISCORD_BOT_PREFIX!);
	// Load modules
	console.log('Loading modules...');
	baseClient.addModule(new GameModule());
	await baseClient.loadModules();
	// Load events
	await baseClient.loadEvents();
	await baseClient.run(process.env.DISCORD_BOT_TOKEN);
}

main();