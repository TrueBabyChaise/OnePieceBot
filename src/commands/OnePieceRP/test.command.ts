import { Colors, Message } from "discord.js";
import { BaseCommand, BaseClient } from "@src/structures";
import { PermissionsBitField } from "discord.js";
import { GuildHandler } from "@src/structures/database/handler/guild.handler.class";


/**
 * @description CreateRoleMember command
 * @class CreateRoleMember
 * @extends BaseCommand
 * @method execute - Executes the command
 */
export class CreateRoleMemberCommand extends BaseCommand {
	constructor() {
		super("onepiece", ["op"], "Create a role member", "Moderation", 0, true, []);
	}

	/**
     * @description Executes the command
     * @param {BaseClient} client
     * @param {Message} message
     * @param {string[]} args
     * @returns {Promise<void>}
     */
    async execute(client: BaseClient, message: Message, args: string[]): Promise<void> {
        await message.reply("This command is not available yet, wonder")            
    }
}

