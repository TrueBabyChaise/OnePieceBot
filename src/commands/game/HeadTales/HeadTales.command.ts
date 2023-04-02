import { Message } from 'discord.js';
import { BaseCommand, BaseClient } from "@src/structures";
import { ButtonBuilder, ActionRowBuilder } from '@discordjs/builders';
import { ButtonStyle } from 'discord.js';

/**
 * @description HeadTales command
 * @class HeadTales
 * @extends BaseCommand
 */
export class HeadTalesCommand extends BaseCommand {
	constructor() {
		super('headtales', ['ht'], 'Head Tales', 'Game', 0, true, []);
	}

	/**
	 * @description Executes the command
	 * @param {BaseClient} client
	 * @param {Message} message
	 * @param {string[]} args
	 * @returns {Promise<void>}
	 */
	async execute(client: BaseClient, message: Message, args: string[]): Promise<void> {
		message.channel.send('Head Tales');

		const row = new ActionRowBuilder<ButtonBuilder>()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('head')
					.setLabel('Head')
					.setStyle(ButtonStyle.Primary),
				new ButtonBuilder()
					.setCustomId('tails')
					.setLabel('Tails')
					.setStyle(ButtonStyle.Primary),
			);
		const msg = await message.channel.send({ content: 'Choose Head or Tails', components: [row] });
		msg.react('👍');


	}
}