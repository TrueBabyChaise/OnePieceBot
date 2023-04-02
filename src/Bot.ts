require('dotenv').config(); // LOAD CONFIG (.env)
import { Client, GatewayIntentBits, Partials, REST } from 'discord.js';
import { BaseClient } from '@src/structures';
import { GameModule } from './modules/Game.module';

import { DBConnection } from './structures/database/dbConnection.db.class';

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
		GatewayIntentBits.GuildMessageReactions,
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


async function load() {
	new Promise(async (resolve, reject) => {
		const res = await DBConnection.getInstance().sequelize.sync();
		resolve(res);
	});
}

async function main() {
	
	await load();

	console.log('Starting bot...');
	if (!process.env.DISCORD_BOT_TOKEN) throw new Error('DISCORD_BOT_TOKEN is not defined in .env');
	if (!process.env.DISCORD_BOT_PREFIX) throw new Error('DISCORD_BOT_PREFIX is not defined in .env');
	if (!process.env.DISCORD_BOT_APP_ID) throw new Error('DISCORD_BOT_APP_ID is not defined in .env');
	
	const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);
	const baseClient = new BaseClient(config, process.env.DISCORD_BOT_PREFIX, process.env.DISCORD_BOT_APP_ID, rest);
	// Load modules
	console.log('Loading modules...');
	baseClient.addModule(new GameModule());
	await baseClient.loadModules();
	// Load events
	await baseClient.loadEvents();
	await baseClient.run(process.env.DISCORD_BOT_TOKEN);
}

main();