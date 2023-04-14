import { BaseSlashCommand, BaseClient } from "@src/structures";
import { ChatInputCommandInteraction, Colors, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageCreateOptions } from "discord.js";
import { SlashCommandOptionType } from "@src/structures";
import { MessageOptions } from "child_process";

/**
 * @description Help slash command
 * @class Help
 * @extends BaseSlashCommand
 */
export class HelpSlashCommand extends BaseSlashCommand {
	constructor() {
		super('help', 'Get help with the bot', [
            {
                name: 'command',
                description: 'The command to get help with',
                required: false,
                type: SlashCommandOptionType.STRING
            } 
        ], 0, true, []);
    }

    /**
     * @description Executes the slash command
     * @param {BaseClient} client
     * @param {ChatInputCommandInteraction} interaction
     * @returns {Promise<void>}
     */
    async execute(client: BaseClient, interaction: ChatInputCommandInteraction): Promise<void> {
        const commandOption = interaction.options.get('command')

        if (!interaction.channel) {
            await interaction.reply({content: 'Something went wrong!', ephemeral: true});
            return;
        };

        if (!commandOption) {
            await interaction.channel?.send(HelpSlashCommand.optionsHelpCommandEmbed(client));
        } else {
            let command = null;

            for (const module of client.getModules().values()) {
                for (const cmd of module.getCommands().values()) {
                    if (cmd.getName() === commandOption.value) {
                        command = cmd;
                        break;
                    }
                }
            }

            if (!command) {
                await interaction.reply({content: 'Something went wrong!', ephemeral: true});
                return;
            }

            const embed = new EmbedBuilder()
                .setTitle(`Help - ${command.getName()}`)
                .setColor(Colors.DarkButNotBlack)
                .setDescription(command.getDescription())
                .addFields({name: 'Usage', value: `\`${command.getUsage()}\``, inline: false})
                .addFields({name: 'Cooldown', value: `${command.getCooldown()} seconds`, inline: false})
                .addFields({name: 'Permissions', value: `${command.getPermissions().map((permission) => `\`${permission}\``).join(', ')}`, inline: false})
                .addFields({name: 'Aliases', value: `${command.getAliases().map((alias) => `\`${alias}\``).join(', ')}`, inline: false})
                .addFields({name: 'NSFW', value: `${command.isNSFW() ? 'Yes' : 'No'}`, inline: false})


            await interaction.channel?.send({embeds: [embed]});
        }
        interaction.reply({content: `Hope, it'll help ! `, ephemeral: true});
    }

    public static optionsHelpCommandEmbed(client: BaseClient, moduleName: string = '', pageNumber: number = 0, onlyPage: boolean = true): MessageCreateOptions {
        const module = client.getModules().get(moduleName);
        if (!module) return HelpSlashCommand.optionsHelpCommandEmbed(client, client.getModules().keys().next().value, 1, false);
        const pageMax = Math.ceil(module.getCommands().size / 10);
        const moduleIndex = Array.from(client.getModules().keys()).indexOf(moduleName);
        const embed = new EmbedBuilder()
            .setTitle('Help')
            .setColor(Colors.DarkButNotBlack)
            .setDescription('Here is a list of all the commands you can use with the bot. You can also use the `help <command>` command to get more information about a specific command.')
            .setFooter({text: `Page ${pageNumber}/${pageMax} of Module ${moduleIndex}/${client.getModules().size} - ${module.getName()}`})
    
        embed.addFields({name: module.getName(), value: module.getDescription(), inline: false});
        for (const command of module.getCommands().values()) {
            embed.addFields({name: command.getName(), value: command.getDescription(), inline: false});
        }

        const row = new ActionRowBuilder<ButtonBuilder>()
			.addComponents(
				new ButtonBuilder()
                    .setCustomId('helppreviousmodule')
                    .setLabel('Previous Module')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji({
                        name: '⏪'
                    })
            );
        if (!onlyPage) {
            row.addComponents(
                new ButtonBuilder()
                    .setCustomId('helppreviouspage')
                    .setLabel('Previous Page')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji({
                        name: '⬅️'
                    }),
            );
        }
        row.addComponents(  
            new ButtonBuilder()
                .setCustomId('helpclose')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji({
                    name: '❌'
                })
        );
        if (!onlyPage) {
            row.addComponents(
                new ButtonBuilder()
                    .setCustomId('helpnextpage')
                    .setLabel('Next Page')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji({
                        name: '➡️'
                    })
            );
        }
        row.addComponents(
            new ButtonBuilder()
                .setCustomId('helpnextmodule')
                .setLabel('Next Module')
                .setStyle(ButtonStyle.Primary)
                .setEmoji({
                    name: '⏩'
                })
		);
        
	    return { embeds: [embed], components: [row]}
    }
}