import { ButtonBuilder, ActionRowBuilder } from '@discordjs/builders';
import { ButtonStyle, MessageType, ChatInputCommandInteraction, 
	TextChannel, Message, MessageCreateOptions, User, OverwriteResolvable} from 'discord.js';
import { EmbedBuilder } from 'discord.js';
import fs from 'fs';
import { BaseClient } from '@src/structures';
import { TicketDB  } from '../class/ticket.class';

export class Ticket {
	private id: string;
	private channel: TextChannel;
	private owner: string;
	private isBeingDeleted: boolean = false;
	private isDeleted: boolean = false;
	private isClosed: boolean = false;
	private messageEmbed: Message<boolean> | null = null;
	private permissions: Array<OverwriteResolvable>;
	private ticketDB: TicketDB | null = null;

	constructor(channel: TextChannel, owner: string, permissions: Array<OverwriteResolvable>) {
		this.id = channel.id;
		this.channel = channel;
		this.messageEmbed = null;
		this.owner = owner;
		this.permissions = permissions;

		(async () => {
			this.ticketDB = await TicketDB.getTicketById(channel.id);
			if (!this.ticketDB) {
				console.log('Ticket not found, creating new ticket');
				this.messageEmbed = await channel.send(this.optionsTicketCommandEmbed(this.isClosed))
				this.ticketDB = await TicketDB.createTicket(channel.id, owner, permissions, this.messageEmbed.id);
				this.ticketDB?.addTicketToGuild(channel.guild.id);
				this.ticketDB?.addTicketToUser(owner);
				return;
			} else {
				this.messageEmbed = await channel.messages.fetch(this.ticketDB.embedMessage);
			}
			console.log('Ticket found');
			console.log(this.ticketDB);
		})();
   	}

   	public setIsBeingDeleted(isBeingDeleted: boolean) {
	   this.isBeingDeleted = isBeingDeleted;
	}

	public async isTicketChannel(channelId: string): Promise<boolean> {
		return this.id === channelId;
	}

	public async addUser(user: User) {
		
		await this.channel.permissionOverwrites.edit(user, {
			SendMessages: true,
			ViewChannel: true,
		});

		this.ticketDB?.addTicketToUser(user.id);
		this.channel.send(`Added ${`<@${user.id}>`} to the ticket!`);
		
	}

	public async removeUser(user: User) {
		await this.channel.permissionOverwrites.edit(user, {
			SendMessages: false,
			ViewChannel: false,
		});

		this.ticketDB?.removeTicketOfUser(user.id);
		this.channel.send(`Removed ${`<@${user.id}>`} from the ticket!`);
	}

	public async openTicket(interaction: ChatInputCommandInteraction, client: BaseClient) {
		const channel = client.channels.cache.get(this.id) as TextChannel;
		if (!channel) {
			await interaction.reply('Ticket could not be opened!');
			return;
		}

		await channel.permissionOverwrites.edit(interaction.guild!.roles.everyone, {
			SendMessages: true,
		});

		this.isClosed = false;
		let isChanged = false;

		this.ticketDB?.permissions.find((permission) => {
			if (permission.id === interaction.guild!.roles.everyone.id) {
				permission.allow = ['SendMessages']
				permission.deny = ['ViewChannel']
				isChanged = true;
			}
		});

		if (!isChanged) {
			this.ticketDB?.permissions.push({
				id: interaction.guild!.roles.everyone.id,
				allow: ['SendMessages'],
				deny: ['ViewChannel']
			});
		}

		
		if (this.messageEmbed) {
			await this.messageEmbed.delete();
			this.messageEmbed = await channel.send(this.optionsTicketCommandEmbed(this.isClosed));
			this.ticketDB!.embedMessage = this.messageEmbed.id;
		}

		this.ticketDB?.save();

		interaction.reply('Ticket Open!');
		setTimeout(() => {
			interaction.deleteReply();
		}, 3000);
	}

	public async closeTicket(interaction: ChatInputCommandInteraction, client: BaseClient) {
		const channel = client.channels.cache.get(this.id) as TextChannel;
		if (!channel) {
			await interaction.reply('Ticket could not be closed!');
			return;
		}

		await channel.permissionOverwrites.edit(interaction.guild!.roles.everyone, {
			SendMessages: false,
		});

		let isChanged = false;

		this.ticketDB?.permissions.find((permission) => {
			if (permission.id === interaction.guild!.roles.everyone.id) {
				permission.deny = ['ViewChannel', 'SendMessages']
				permission.allow = []
				isChanged = true;
			}
		});

		if (!isChanged) {
			this.ticketDB?.permissions.push({
				id: interaction.guild!.roles.everyone.id,
				deny: ['ViewChannel', 'SendMessages'],
				allow: []
			});
		}

		this.isClosed = true;

		console.log(this.messageEmbed)
		if (this.messageEmbed) {
			await this.messageEmbed.delete();
			this.messageEmbed = await channel.send(this.optionsTicketCommandEmbed(this.isClosed));
			this.ticketDB!.embedMessage = this.messageEmbed.id;
		}

		this.ticketDB?.save();


		interaction.reply('Ticket closed!');
		setTimeout(() => {
			interaction.deleteReply();
		}, 3000);
	}
			

	public async deleteTicket(interaction: ChatInputCommandInteraction, client: BaseClient) {
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

        this.isBeingDeleted = true;
        let i = 9;
        const interval = setInterval(async () => {
            try {
                if (this.isDeleted) {
                    await interaction.channel!.delete();
					this.ticketDB?.delete();
					clearInterval(interval);
					return;
                }
                if (!this.isBeingDeleted) {
                    await sendMessage.edit({ content: 'Delete canceled (This message will deleted soon)', components: [] });
					await interaction.deleteReply();
					setTimeout(() => {
						sendMessage.delete()
					}, 3000);
					clearInterval(interval);
                    return;
                }
                if (i > 0 && this.isBeingDeleted)
                    await interaction.editReply(`Ticket will be deleted in ${i} seconds`);
                i--;
                if (i < 0 && this.isBeingDeleted) {
                    await interaction.editReply('Ticket deleted!');
                    if (interaction.channel) {
						this.isDeleted = true;
                    } else {
                        await interaction.editReply('Ticket could not be deleted!');
                    }
                }
            } catch (e) {
                console.log(e);
            }
        }, 1000);
	}

	private async loadStyles() {
        const css = fs.readFileSync('./src/structures/css/transcript.css', 'utf8');
        return css;
    }

	private messageContentCodeBlock(code: string) {
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

	private messageHtmlCreator = (message: Message) => {

		const isValidUrl = (urlString: string) => {
            try { 
                return Boolean(new URL(urlString)); 
            }
            catch(e){ 
                return false; 
            }
        }

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
						toAdd += `<div class="code">${this.messageContentCodeBlock(message.content)}</div>`;
					else
						toAdd += `<div class='chatInput'>${message.content}</div>`;
			}
		}
		return toAdd;
	}

	async buildTranscript(guildId: string, client: BaseClient) {
        const guild = client.guilds.cache.get(guildId);
        const channel = guild?.channels.cache.get(this.id) as TextChannel;
        const messages = (await channel.messages.fetch({ cache: true })).reverse();

        let transcript = "<body>";
        transcript += "<head><style>" + await this.loadStyles() + "</style></head>";

        transcript += "<div class='chatBox'>";

        let lastUser = "none";
        let lastTime = "-1:-1";
        let lastDate = "-1/-1/-1";

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
                + this.messageHtmlCreator(message);
            } else {
                transcript += this.messageHtmlCreator(message);
            }
            transcript += `</div></li>`;
            lastUser = message.author.id;
            lastTime = timeFormatted;
            lastDate = dateFormatted;
        })

        transcript += "</div></body>";
        return transcript;
    }

	private optionsTicketCommandEmbed(isClosed: boolean): MessageCreateOptions {
		console.log(isClosed);
		const row = new ActionRowBuilder<ButtonBuilder>()
			.addComponents(
				new ButtonBuilder()
					.setCustomId(isClosed ? 'ticketopen' : 'ticketclose')
					.setLabel(isClosed ? 'Open Ticket' : 'Close Ticket')
					.setStyle(ButtonStyle.Secondary)
					.setEmoji({
						name: isClosed ? '🔓' : '🔒',
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
}