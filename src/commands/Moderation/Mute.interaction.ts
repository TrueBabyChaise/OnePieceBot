import { BaseSlashCommand, BaseClient } from "@src/structures";
import { ChatInputCommandInteraction, Colors, GuildMember, PermissionsBitField } from "discord.js";
import { SlashCommandOptionType } from "@src/structures";
import { PermissionFlagsBits } from "discord.js";

/**
 * @description Mute slash command
 * @class Mute
 * @extends BaseSlashCommand
 */
export class MuteSlashCommand extends BaseSlashCommand {
	constructor() {
		super('mute', 'Mute a member', [
            {
                name: 'member',
                description: 'The member to mute',
                required: true,
                type: SlashCommandOptionType.USER
            },
            {
                name: 'time',
                description: 'The time to mute the member',
                required: true,
                type: SlashCommandOptionType.INTEGER
            },
            {
                name: 'reason',
                description: 'The reason for the mute',
                required: false,
                type: SlashCommandOptionType.STRING
            }
        ], 0, true, [PermissionFlagsBits.MuteMembers]);
	}

	/**
	 * @description Executes the slash command
	 * @param {BaseClient} client
	 * @param {ChatInputCommandInteraction} interaction
	 * @returns {Promise<void>}
	 */
	async execute(client: BaseClient, interaction: ChatInputCommandInteraction): Promise<void> {
        const memberOption = interaction.options.get('member')
        const timeOption = interaction.options.get('time')

        if (!memberOption || !timeOption) {
            await interaction.reply('Something went wrong!');
            return;
        };
        
        const member = memberOption.member;
        const time = timeOption.value as number;

        if (!member || !time || !interaction.guild) {
            await interaction.reply('Something went wrong!');
            return;
        };

        if (!(member instanceof GuildMember)) {
            await interaction.reply('Something went wrong!');
            return;
        };
        
        const role = interaction.guild.roles.cache.find(role => role.name === 'Muted');
        if (!role) {
            const permissions = new PermissionsBitField();
            permissions.remove(PermissionFlagsBits.SendMessages);
            interaction.guild.roles.create({
                name: 'Muted',
                color: Colors.DarkGrey,
                permissions: []
            }).then(async role => {
                member.roles.add(role);
                setTimeout(async () => {
                    if (member.roles.cache.has(role.id))
                        await member.roles.remove(role);
                }, time * 1000);
            });
        } else {
            await member.roles.add(role);
            setTimeout(async () => {
                if (member.roles.cache.has(role.id))
                    await member.roles.remove(role);
            }, time * 1000);
        };
        const everyoneRole = interaction.guild.roles.everyone;
        if (everyoneRole.permissions.has(PermissionFlagsBits.SendMessages)) {
            await interaction.reply(`Muted ${member} for ${timeOption.value} seconds! (Everyone role has send messages permission, so the member can still send messages)
You can fix this by asking Kikku to create a member role.`);
        } else {
            await interaction.reply(`Muted ${member} for ${timeOption.value} seconds!`);
        }
	}
}
