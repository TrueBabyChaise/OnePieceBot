import { BaseSlashCommand, BaseClient } from "@src/structures";
import { ItemHandler } from "@src/structures/database/handler/item.db.model";
import { ChatInputCommandInteraction, InteractionReplyOptions, ButtonBuilder, ActionRowBuilder, ButtonStyle, EmbedBuilder, Colors } from "discord.js";

/**
 * @description ListInventory Command
 * @class ListInventory
 * @extends BaseSlashCommand
 */
export class ListInventoryCommand extends BaseSlashCommand {
	constructor() {
		super("item-inventory", "Shop", [], 0, true, []);
	}

	/**
	 * @description Executes the slash command
	 * @param {BaseClient} client
	 * @param {ChatInputCommandInteraction} interaction
	 * @returns {Promise<void>}
	 */
	async execute(client: BaseClient, interaction: ChatInputCommandInteraction): Promise<void> {
        let response = await ListInventoryCommand.optionsListCommandEmbed(client, 0, interaction.user.id);
        response.ephemeral = true;
        await interaction.reply(response);
	}

    public static async optionsListCommandEmbed(client: BaseClient, pageIndex: number, userId: string): Promise<InteractionReplyOptions> {
        const items = await ItemHandler.getItemsOfUser(userId);
        const nbPages = Math.ceil(items.length / 10);
        pageIndex = pageIndex - 1;
        if (pageIndex < 0) pageIndex = nbPages - 1;
        if (pageIndex >= nbPages) pageIndex = 0;
        const embed = new EmbedBuilder()
            .setTitle("Inventory")
            .setColor(Colors.Blue)
            .setDescription("Items in your inventory")
            .setFooter({ text: `${pageIndex + 1}/${nbPages}` })
            .setTimestamp();
        if (items.length == 0) {
            embed.setDescription("No items in your inventory");
        } else {
            for (let i = pageIndex * 10; i < pageIndex * 10 + 10 && i < items.length; i++) {
                console.log(items[i]);
                embed.addFields({
                    name: items[i].name,
                    value: `Price: ${items[i].price == 0 ? "Free" : items[i].price}  Stocks: ${items[i].stocks == -1 ? "∞" : items[i].stocks}`,
                });
            }
        }   

        const actionRow = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("invprevpage")
                    .setLabel("Previous page")
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("invnextpage")
                    .setLabel("Next page")
                    .setStyle(ButtonStyle.Primary)
            );

        return { embeds: [embed], components: [actionRow] };
    }
}
