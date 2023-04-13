import { Colors, Message } from "discord.js";
import { BaseCommand, BaseClient } from "@src/structures";
import { PermissionsBitField } from "discord.js";


/**
 * @description CreateRoleMember command
 * @class CreateRoleMember
 * @extends BaseCommand
 * @method execute - Executes the command
 */
export class CreateRoleMemberCommand extends BaseCommand {
    constructor() {
        super("createrolemember", ["createrm"], "Create a role member", "Moderation", 0, true, []);
    }

    /**
     * @description Executes the command
     * @param {BaseClient} client
     * @param {Message} message
     * @param {string[]} args
     * @returns {Promise<void>}
     */
    async execute(client: BaseClient, message: Message, args: string[]): Promise<void> {
        if (args.length == 0) {
            message.channel.send("Please provide a role name");
            return;
        }

        const roleName = args.join(" ");
        const guild = message.guild;
        if (!guild) {
            message.channel.send("Guild not found");
            return;
        }
        const role = message.guild.roles.cache.find((r) => r.name === roleName);
        if (role) {
            message.channel.send("Role already exists");
            return;
        } else {
            const permissions = new PermissionsBitField();
            permissions.add('SendMessages');
            guild.roles.create({
                name: roleName,
                color: Colors.Blue,
                mentionable: true,
                permissions: permissions
            });
            message.channel.send(`Role ${roleName} created`);
        }
    }
}
