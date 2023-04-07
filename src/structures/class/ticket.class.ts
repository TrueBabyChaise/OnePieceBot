import { OverwriteResolvable } from "discord.js";
import { TicketModel, GuildTicketModel, UserTicketModel } from "../database/models/ticket.db.model";

export class Ticket {
    private _id: number = 0;
    private _owner: number = 0;
    private _permissions: Array<OverwriteResolvable> = [];
    private _users: number[] = [];

    public get id(): number {
        return this._id;
    }

    public get owner(): number {
        return this._owner;
    }

    public get permissions(): Array<OverwriteResolvable> {
        return this._permissions;
    }

    public get users(): number[] {
        return this._users;
    }

    public static async getTicketById(id: number): Promise<Ticket | null> {
        const ticket = new Ticket();
        const ticketDB = await TicketModel.findOne({ where: { id: id } });
        if (!ticketDB) { return null; }
        ticket._id = ticketDB.get("id") as number;
        ticket._owner = ticketDB.get("owner") as number;
        ticket._permissions = ticketDB.get("permissions") as Array<OverwriteResolvable>;
        return ticket;
    }

    public static async createTicket(id: number, owner: number, permissions: object): Promise<Ticket | null> {
        const ticket = new Ticket();
        const ticketDB = await TicketModel.create({ id: id, owner: owner, permissions: permissions });
        if (!ticketDB) { return null; }
        ticket._id = ticketDB.get("id") as number;
        ticket._owner = ticketDB.get("owner") as number;
        ticket._permissions = ticketDB.get("permissions") as Array<OverwriteResolvable>;
        return ticket;
    }

    public static async deleteTicket(id: number): Promise<boolean> {
        const ticketDB = await TicketModel.destroy({ where: { id: id } });
        if (!ticketDB) { return false; }
        return true;
    }

    public static async updateTicket(id: number, owner: number, permissions: object): Promise<boolean> {
        const ticketDB = await TicketModel.update({ owner: owner, permissions: permissions }, { where: { id: id } });
        if (!ticketDB) { return false; }
        return true;
    }

    public static async getTicketByOwner(owner: number): Promise<Ticket[] | null> {
        const ticket = new Array<Ticket>();
        const ticketDB = await TicketModel.findAll({ where: { owner: owner } });
        if (!ticketDB) { return null; }
        for (let i = 0; i < ticketDB.length; i++) {
            ticket[i] = new Ticket();
            ticket[i]._id = ticketDB[i].get("id") as number;
            ticket[i]._owner = ticketDB[i].get("owner") as number;
            ticket[i]._permissions = ticketDB[i].get("permissions") as Array<OverwriteResolvable>;
        }
        return ticket;
    }

    public async addTicketToUser(user: number): Promise<boolean> {
        const ticketDB = await UserTicketModel.create({ fkTicket: this._id, fkUser: user });
        if (!ticketDB) { return false; }
        return true;
    }

    public async removeTicketOfUser(user: number): Promise<boolean> {
        const ticketDB = await UserTicketModel.destroy({ where: { fkTicket: this._id, fkUser: user } });
        if (!ticketDB) { return false; }
        return true;
    }

    public async getUserOfTicket(): Promise<number[] | null> {
        const ticket = new Array<number>();
        const ticketDB = await UserTicketModel.findAll({ where: { fkTicket: this._id } });
        if (!ticketDB) { return null; }
        for (let i = 0; i < ticketDB.length; i++) {
            ticket[i] = ticketDB[i].get("user") as number;
        }
        return ticket;
    }

    public static async getTicketOfUser(id: number): Promise<number[] | null> {
        const ticket = new Array<number>();
        const ticketDB = await UserTicketModel.findAll({ where: { fkUser: id } });
        if (!ticketDB) { return null; }
        for (let i = 0; i < ticketDB.length; i++) {
            ticket[i] = ticketDB[i].get("ticket") as number;
        }
        return ticket;
    }

    public async addTicketToGuild(guild: number): Promise<boolean> {
        const ticketDB = await GuildTicketModel.create({ fkTicket: this._id, fkGuild: guild });
        if (!ticketDB) { return false; }
        return true;
    }

    public async removeTicketOfGuild(guild: number): Promise<boolean> {
        const ticketDB = await GuildTicketModel.destroy({ where: { fkTicket: this._id, fkGuild: guild } });
        if (!ticketDB) { return false; }
        return true;
    }

    public static async getTicketOfGuild(id: number): Promise<number[] | null> {
        const ticket = new Array<number>();
        const ticketDB = await GuildTicketModel.findAll({ where: { fkGuild: id } });
        if (!ticketDB) { return null; }
        for (let i = 0; i < ticketDB.length; i++) {
            ticket[i] = ticketDB[i].get("fkTicket") as number;
        }
        return ticket;
    }
}