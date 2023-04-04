import { Message, EmbedBuilder, TextChannel, ChannelType, ColorResolvable, Colors, CategoryChannelResolvable, MessageCreateOptions, GuildChannel, Channel } from 'discord.js';
import { BaseEvent, BaseClient } from '@src/structures';
import { ButtonBuilder, ActionRowBuilder } from '@discordjs/builders';
import { ButtonStyle, MessageType, ChatInputCommandInteraction } from 'discord.js';
import fs from 'fs';
import { send } from 'process';
import { setTimeout } from 'timers/promises';

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
    private ticketBeingDeleted: Map<string, boolean> = new Map();

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

    async deleteTicket(interaction: ChatInputCommandInteraction, client: BaseClient) {
        await interaction.reply('Ticket will be deleted in 10 seconds');
        const channel = interaction.channel;
        if (!channel) {
            await interaction.editReply('Ticket could not be deleted!');
            return;
        }

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('ticketcanceldelete')
                    .setLabel('Cancel')
                    .setStyle(ButtonStyle.Danger)
            );
        const sendMessage = await channel.send({ content : "'You can cancel the deletion of the ticket by clicking on the button below'", components: [row] });

        this.ticketBeingDeleted.set(interaction.channel!.id, true);
        let i = 9;
        const interval = setInterval(async () => {
            try {
                if (!this.ticketBeingDeleted.has(interaction.channel!.id)) {
                    await interaction.deleteReply();
                    clearInterval(interval);
                }
                if (this.ticketBeingDeleted.get(interaction.channel!.id) === false) {
                    this.ticketBeingDeleted.delete(interaction.channel!.id);
                    await sendMessage.edit({ content: 'Delete canceled', components: [] });
                    setTimeout(5000, async () => {
                        await sendMessage.delete();
                    });
                    return;
                }
                if (i > 0 && this.ticketBeingDeleted.get(interaction.channel!.id) === true)
                    await interaction.editReply(`Ticket will be deleted in ${i} seconds`);
                i--;
                if (i < 0 && this.ticketBeingDeleted.get(interaction.channel!.id) === true) {
                    await interaction.editReply('Ticket deleted!');
                    if (interaction.channel) {
                        this.ticketBeingDeleted.delete(interaction.channel.id);
                        await interaction.channel.delete();
                        clearInterval(interval);
                    } else {
                        await interaction.editReply('Ticket could not be deleted!');
                    }
                    clearInterval(interval);
                }
            } catch (e) {
                console.log(e);
            }
        }, 1000);
    }

    async cancelDeleteTicket(channelId: string,  client: BaseClient) {
        this.ticketBeingDeleted.set(channelId, false);
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
        const messages = (await channel.messages.fetch({ cache: true })).reverse();

        let transcript = "<body>";
        transcript += "<head><style>" + await this.loadStyles() + "</style></head>";

        transcript += "<div class='chatBox'>";

        let lastUser = "none";
        let lastTime = "-1:-1";
        let lastDate = "-1/-1/-1";

        const isValidUrl = (urlString: string) => {
            try { 
                return Boolean(new URL(urlString)); 
            }
            catch(e){ 
                return false; 
            }
        }

        const codeRefortmatter = (code: string) => {
            let formatted = code;
            formatted = formatted.replace(/</g, "&lt;");
            formatted = formatted.replace(/>/g, "&gt;");
            formatted = formatted.replace(/"/g, "&quot;");
            formatted = formatted.replace(/'/g, "&#039;");
            formatted = formatted.replace(/`/g, "&#96;");
            formatted = formatted.replace(/,/g, "&#44;");
            formatted = formatted.replace(/:/g, "&#58;");
            formatted = formatted.replace(/=/g, "&#61;");
            formatted = formatted.replace(/@/g, "&#64;");
            formatted = formatted.replace(/\$/g, "&#36;");
            formatted = formatted.replace(/%/g, "&#37;");
            formatted = formatted.replace(/\^/g, "&#94;");
            formatted = formatted.replace(/\*/g, "&#42;");
            formatted = formatted.replace(/\(/g, "&#40;");
            formatted = formatted.replace(/\)/g, "&#41;");

            let newArea = formatted.split("\n");
            newArea.pop();
            newArea.shift();

            formatted = newArea.join("\n");
            formatted = formatted.replaceAll('\n', '<br>');
            return `${formatted}`;
        }

        const messageHtmlCreator = (message: Message) => {
            let toAdd = '';
            if (message.attachments.size > 0) {
                const keys = message.attachments.keys();
                if (message.content) toAdd += `<div class='chatInput'>${message.content}</div></div><div class='chatContent'>`;
                for (let i = 0; i < message.attachments.size; i++) {
                    if (i > 0) toAdd += `</div><li style='padding-top: 5px;'></li><div class='chatContent'>`;
                    const attachment = message.attachments.get(keys.next().value);
                    if (!attachment) continue;
                    if (attachment.height) {
                        toAdd += `<img class='chatImage' src='${attachment.proxyURL}'>`;
                    } else {
                        toAdd += `<div class='chatInput'><a href='${attachment.url}'>${attachment.name}</a></div>`;
                    }
                }
            } else {
                if (message.content) {
                    if (isValidUrl(message.content))
                        if (message.content.includes('tenor.com')
                        || message.content.includes('giphy.com'))
                            toAdd += `<img class='chatGif' src='${message.content + '.gif'}'>`;
                        else
                            toAdd += `<div class='chatInput'><a href='${message.content}'>${message.content}</a></div>`; 
                    else
                        if (message.content.startsWith('```'))
                            toAdd += `<div class="code">${codeRefortmatter(message.content)}</div>`;
                        else
                            toAdd += `<div class='chatInput'>${message.content}</div>`;
                }
            }
            return toAdd;
        }


        messages.forEach((message) => {
            const date = new Date(message.createdTimestamp);
            const dateFormatted = date.toLocaleDateString()
            const timeFormatted = date.getHours() + ':' + date.getMinutes();
            const GMT = date.getTimezoneOffset() / 60;

            if (message.author.bot) return;
            if (lastUser != message.author.id && lastUser != "none")
                transcript += `<li style='padding-top: 20px;'></li>`
            transcript += `<li class='chatListItem'><div class='chatContent'>`;
            if (lastUser != message.author.id || lastTime.split(':')[1] != timeFormatted.split(':')[1] || lastDate != dateFormatted) {
                transcript += 
                `<div class='userContent'>`
                + `<div class='chatUsername username'>${message.author.username}</div>`
                + `<div class='chatUsername userId'>${message.author.tag + ' ' + message.author.id}</div>`
                + `<div class='chatTimeStamp'>Today at ${timeFormatted + ` UTC + ${GMT}`}</div>`
                + `<img class='chatAvatar' src='${message.author.displayAvatarURL({ forceStatic: true})}' alt=${message.author.username}>`
                + `</div></div>`
                + `<div class='chatContent'>`
                + messageHtmlCreator(message);
            } else {
                transcript += messageHtmlCreator(message);
            }
            transcript += `</div></li>`;
            lastUser = message.author.id;
            lastTime = timeFormatted;
            lastDate = dateFormatted;
        })

        transcript += "</div></body>";
        return transcript;
    }

    async loadStyles() {
        const css = fs.readFileSync('./src/structures/css/transcript.css', 'utf8');
        return css;
    }
}
