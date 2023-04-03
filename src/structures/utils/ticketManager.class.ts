import { Message, EmbedBuilder, TextChannel, ChannelType, ColorResolvable, Colors, CategoryChannelResolvable, MessageCreateOptions, GuildChannel, Channel } from 'discord.js';
import { BaseEvent, BaseClient } from '@src/structures';
import { ButtonBuilder, ActionRowBuilder } from '@discordjs/builders';
import { ButtonStyle } from 'discord.js';
import fs from 'fs';

interface EmbebError {
    title: string;
    description: string;
    color: ColorResolvable;
}

/**
 * @description Ticket Manager
 * @class TicketManager
 */
export class TicketManager {
    private static instance: TicketManager = new TicketManager();
    private guildTickets: Map<string, Map<string, string>> = new Map();

    constructor() {
        if (TicketManager.instance) {
            throw new Error('Error: Instantiation failed: Use TicketManager.getInstance() instead of new.');
        }
        TicketManager.instance = this;
    }

    /**
     * @description Instance of TicketManager
     * @returns {TicketManager} TicketManager instance
     */
    public static getInstance(): TicketManager {
        return TicketManager.instance;
    }

    /**
     * @description Get tickets of a guild
     * @param guildId 
     * @returns 
     */
    public getTickets(guildId: string): Map<string, string> | undefined {
        return this.guildTickets.get(guildId);
    }

    /**
     * @description Create a ticket
     * @param {Message} message
     * @param {BaseClient} client
     * @returns {Promise<void>}
     */
    async createTicket(message: Message, client: BaseClient) {
        const channel = message.channel as TextChannel;
        const guild = message.guild;
        const member = message.member;
        // Need CategoryChannelResolvable
        if (!guild || !guild.id) {
            const embedError = this.buildEmbedError(message, client, {
                title: 'Error',
                description: 'The guild does not exist',
                color: Colors.Red,
            });
            message.channel.send({ embeds: [embedError] });
            return;
        }
        const ticketCategory = guild?.channels.cache.find(channel => channel.name === 'Tickets') as CategoryChannelResolvable;
        if (!ticketCategory) {
            const embedError = this.buildEmbedError(message, client, {
                title: 'Error',
                description: 'The category `Tickets` does not exist',
                color: Colors.Red,
            });
            message.channel.send({ embeds: [embedError] });
        }
        const ticketChannel = await guild?.channels.create({
            name: `ticket-${member?.user.username}`,
            type: ChannelType.GuildText,
            parent: ticketCategory,
        });

        ticketChannel?.send(this.optionsTicketCommandEmbed());
        
        if (!this.guildTickets.has(guild!.id))
            this.guildTickets.set(guild!.id, new Map());
        this.guildTickets.get(guild!.id)?.set(member!.id, ticketChannel!.id);
    }


    /**
     * @description Build embed error
     * @param {Message} message
     * @param {BaseClient} client
     * @param {EmbebError} options
     * @returns {EmbedBuilder}
     */
    private buildEmbedError(message: Message, client: BaseClient, options: EmbebError): EmbedBuilder {
        const embedError = new EmbedBuilder()
            .setTitle(options.title)
            .setDescription(options.description)
            .setColor(options.color)
            .setFooter({
                text: `Requested by ${message.author.username}`,
            });
        return embedError;
    }


	async isTicketChannel(channelId: string, guildId: string): Promise<boolean> {
		const tickets = TicketManager.getInstance().getTickets(guildId);
		if (tickets) {
			for (const [key, value] of tickets) {
				if (value == channelId) {
					return true;
				}
			}
		}
		return false;
	}

	async isTicketOwner(userId: string, guildId: string): Promise<boolean> {
		const tickets = TicketManager.getInstance().getTickets(guildId);
		if (tickets) {
			for (const [key, value] of tickets) {
				if (key == userId) {
					return true;
				}
			}
		}
		return false;
	}
	
	private optionsTicketCommandEmbed(): MessageCreateOptions {
		const row = new ActionRowBuilder<ButtonBuilder>()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('ticketclose')
					.setLabel('Close Ticket')
					.setStyle(ButtonStyle.Secondary)
					.setEmoji({
						name: '🔒',
					}),
				/*new ButtonBuilder()
					.setCustomId('addUser')
					.setLabel('Add User')
					.setStyle(ButtonStyle.Success)
					.setEmoji({
						name: '✅',
					}),
				new ButtonBuilder()
					.setCustomId('removeUser')
					.setLabel('Remove User')
					.setStyle(ButtonStyle.Danger)
					.setEmoji({
						name: '❎',
					}),*/
				new ButtonBuilder()
					.setCustomId('ticketsave')
					.setLabel('Save Transcript')
					.setStyle(ButtonStyle.Primary)
					.setEmoji({
						name: '💾',
					}),
				new ButtonBuilder()
					.setCustomId('ticketdelete')
					.setLabel('Delete Ticket')
					.setStyle(ButtonStyle.Danger)
					.setEmoji({
						name: '🗑️',
					}),
			);
					
		
		const embed = new EmbedBuilder()
			.setColor('#0099ff')
			.setTitle('Ticket Options')
			.setDescription('Choose an option')
			.setTimestamp()
			.setFooter({
				text: 'Ticket Options',
			})
	    return {embeds: [embed], components: [row] };
	}

    async buildTranscript(channelId : string, guildId: string, client: BaseClient) {
        const guild = client.guilds.cache.get(guildId);
        const channel = guild?.channels.cache.get(channelId) as TextChannel;
        const messages = await channel.messages.fetch({ limit: 100 });

        let transcript = "<body>";
        transcript + "<head><style>" + await this.loadStyles() + "</style></head>";

        transcript

        messages.forEach((message) => {
            const date = new Date(message.createdTimestamp);
            const formattedDate = date.toLocaleDateString() + " " + date.toLocaleTimeString();
            
            

        })
    }

    async loadStyles() {
        const css = fs.readFileSync('../css/test.css', 'utf8');
        return css;
    }
}
