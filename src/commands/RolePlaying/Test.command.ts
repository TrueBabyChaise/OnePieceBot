import { Message } from "discord.js";
import { BaseCommand, BaseClient, BaseSlashCommand } from "@src/structures";
import { EmbedBuilder, Colors } from "discord.js";
import { GuildHandler } from "@src/structures/database/handler/guild.handler.class";


/**
 * @description CreateRoleMember command
 * @class CreateRoleMember
 * @extends BaseCommand
 * @method execute - Executes the command
 */
export class OnePieceCommand extends BaseCommand {
	constructor() {
		super("onepiece", ["op"], "Create a role member", "RolePlaying", 0, true, []);
	}

	/**
     * @description Executes the command
     * @param {BaseClient} client
     * @param {Message} message
     * @param {string[]} args
     * @returns {Promise<void>}
     */
    async execute(client: BaseClient, message: Message, args: string[]): Promise<void> {

        const shopCommands = client.getModules().get("Shop")?.getInteractions().values();
        const invCommands = client.getModules().get("Inventory")?.getInteractions().values();

        const fields = [] as any;
        if (!shopCommands || !invCommands) return;

        for (const value of [...shopCommands, ...invCommands]) {
            if (!(value instanceof BaseSlashCommand)) continue;
            fields.push({
                name: value.getName(),
                value: value.getDescription(),
            })
        }

        const embed = new EmbedBuilder()
            .setTitle("Commandes")
            .setColor(Colors.Gold)
            .addFields(fields)
            .setTimestamp()


        const cleanEmbed = new EmbedBuilder()
            .setTitle("Commandes")
            .setColor(Colors.Gold)
            .setDescription("L'ensemble des commandes disponibles sont décrient ci-dessous")
            .setTimestamp()

        const invEmbed = new EmbedBuilder()
            .setTitle("Commandes - Inventaire")
            .setColor(Colors.Gold)
            .addFields({
                name: "item-inventory",
                value: "Affiche les items de votre inventaire",
            },
            {
                name: "item-inventory-show",
                value: "Décrit un item de votre inventaire",
            },
            {
                name: "item-use",
                value: "Utilise un item de votre inventaire",
            })
            .setTimestamp()

        const shopEmbed = new EmbedBuilder()
            .setTitle("Commandes - Boutique")
            .setColor(Colors.Gold)
            .addFields({
                name: "item-shop",
                value: "Affiche les items de la boutique",
            },
            {
                name: "item-buy",
                value: "Achète un item de la boutique",
            },
            {
                name: "item-info",
                value: "Affiche les informations d'un item",
            })
            .setTimestamp()
            

        await message.channel.send({
            embeds: [
                cleanEmbed,
                invEmbed,
                shopEmbed,
            ]
        })
    }
}

