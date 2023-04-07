import { Message, EmbedBuilder, TextChannel, ChannelType, ColorResolvable, Colors, CategoryChannelResolvable, MessageCreateOptions, GuildChannel, Channel, Interaction } from 'discord.js';
import { BaseEvent, BaseClient } from '@src/structures';
import { ButtonBuilder, ActionRowBuilder } from '@discordjs/builders';
import { ButtonStyle, MessageType, ChatInputCommandInteraction } from 'discord.js';
import fs from 'fs';
import { Ticket } from './Ticket.class';

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
    private tickets: Map<string, Ticket> = new Map();

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
    public getTicket(channelId: string): Ticket | undefined {
        return this.tickets.get(channelId);
    }

    public setNewTicketFromMessage(message: Message) {
        this.tickets.set(message.channelId!, new Ticket(message.channel as TextChannel));
    }

    /**
     * @description Create a ticket
     * @param {Message} message
     * @param {BaseClient} client
     * @returns {Promise<void>}
     */
    async createTicket(message: Message, client: BaseClient): Promise<void> {
        const channel = message.channel as TextChannel;
        const guild = message.guild;
        const member = message.member;

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
            return;
        }
        const ticketChannel = await guild?.channels.create({
            name: `ticket-${member?.user.username}`,
            type: ChannelType.GuildText,
            parent: ticketCategory,
            permissionOverwrites: [
                {
                    id: guild?.id,
                    deny: ['ViewChannel'],
                },
                {
                    id: member!.user.id,
                    allow: ['ViewChannel'],
                },
            ],
        });
        
        this.tickets.set(ticketChannel?.id!, new Ticket(ticketChannel));
    }

    async deleteTicket(interaction: ChatInputCommandInteraction, client: BaseClient) {
        if (!interaction.channel)
            return;
        if (!this.getTicket(interaction.channelId!)) {
            const embedError = this.buildEmbedError(interaction, client, {
                title: 'Error',
                description: "Can't be deleted because it is not a ticket",
                color: Colors.Red,
            });
            interaction.channel!.send({ embeds: [embedError] });
            return;
        }
        this.tickets.get(interaction.channelId!)?.deleteTicket(interaction, client);
    }

    async cancelDeleteTicket(channelId: string) {
        this.tickets.get(channelId)?.setIsBeingDeleted(false);
    }

    /**
     * @description Build embed error
     * @param {Message} message
     * @param {BaseClient} client
     * @param {EmbebError} options
     * @returns {EmbedBuilder}
     */
    private buildEmbedError(message: Message | ChatInputCommandInteraction, client: BaseClient, options: EmbebError): EmbedBuilder {
        let username = '';
        if (message instanceof ChatInputCommandInteraction)
            username = message.user.username;
        if (message instanceof Message)
            username = message.author.username;
        

        const embedError = new EmbedBuilder()
            .setTitle(options.title)
            .setDescription(options.description)
            .setColor(options.color)
            .setFooter({
                text: `Requested by ${username}`,
            });
        return embedError;
    }
}
