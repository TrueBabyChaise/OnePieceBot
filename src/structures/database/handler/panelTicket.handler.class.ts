import { PanelTicketModel } from "../models/panelTicket.db.model";

export class PanelTicketEnum {
    public static readonly EDIT = 'edit';
    public static readonly TO_DELETE = 'to_delete';
    public static readonly DRAFT = 'draft';
    public static readonly FINISHED = 'finish';
}

export class PanelTicketHandler {
    private _id: string = '';
    private _name: string = '';
    private _description: string = '';
    private _roles: string[] = [];
    private _category: string = '';
    private _transcriptChannel: string = '';
    private _sendChannel: string = '';
    private _status: PanelTicketEnum = PanelTicketEnum.DRAFT;
    private _fkGuild: string = '';
    private _fkUser: string = '';

    public get id(): string {
        return this._id;
    }

    public get name(): string {
        return this._name;
    }

    public get description(): string {
        return this._description;
    }

    public get roles(): string[] {
        return this._roles;
    }

    public get category(): string {
        return this._category;
    }

    public get transcriptChannel(): string {
        return this._transcriptChannel;
    }

    public get sendChannel(): string {
        return this._sendChannel;
    }

    public get status(): PanelTicketEnum {
        return this._status;
    }

    public get fkGuild(): string {
        return this._fkGuild;
    }

    public get fkUser(): string {
        return this._fkUser;
    }

    public static async getPanelTicketById(id: string): Promise<PanelTicketHandler | null> {
        const panelTicket = new PanelTicketHandler();
        const panelTicketDB = await PanelTicketModel.findOne({ where: { id: id } });
        if (!panelTicketDB) { return null; }
        panelTicket._id = panelTicketDB.get("id") as string;
        panelTicket._name = panelTicketDB.get("name") as string;
        panelTicket._description = panelTicketDB.get("description") as string;
        panelTicket._roles = JSON.parse(panelTicketDB.get("roles") as string ? panelTicketDB.get("roles") as string : "[]");
        panelTicket._category = panelTicketDB.get("category") as string;
        panelTicket._transcriptChannel = panelTicketDB.get("transcript_channel") as string;
        panelTicket._sendChannel = panelTicketDB.get("send_channel") as string;
        panelTicket._status = panelTicketDB.get("status") as string;
        panelTicket._fkGuild = panelTicketDB.get("fkGuild") as string;
        panelTicket._fkUser = panelTicketDB.get("fkUser") as string;
        return panelTicket;
    }

    public static async getPanelTicketByName(name: string): Promise<PanelTicketHandler | null> {
        const panelTicket = new PanelTicketHandler();
        const panelTicketDB = await PanelTicketModel.findOne({ where: { name: name } });
        if (!panelTicketDB) { return null; }
        panelTicket._id = panelTicketDB.get("id") as string;
        panelTicket._name = panelTicketDB.get("name") as string;
        panelTicket._description = panelTicketDB.get("description") as string;
        panelTicket._roles = JSON.parse(panelTicketDB.get("roles") as string ? panelTicketDB.get("roles") as string : "[]");
        panelTicket._category = panelTicketDB.get("category") as string;
        panelTicket._transcriptChannel = panelTicketDB.get("transcript_channel") as string;
        panelTicket._sendChannel = panelTicketDB.get("send_channel") as string;
        panelTicket._status = panelTicketDB.get("status") as PanelTicketEnum;
        panelTicket._fkGuild = panelTicketDB.get("fkGuild") as string;
        panelTicket._fkUser = panelTicketDB.get("fkUser") as string;
        return panelTicket;
    }

    public static async getAllPanelTicketByUserAndGuild(userId: string, guildId: string): Promise<PanelTicketHandler[]> {
        const panelTickets: PanelTicketHandler[] = [];
        const panelTicketsDB = await PanelTicketModel.findAll({ where: { fkUser: userId, fkGuild: guildId}});
        if (!panelTicketsDB) { return []; }
        for (const panelTicketDB of panelTicketsDB) {
            const panelTicket = new PanelTicketHandler();
            panelTicket._id = panelTicketDB.get("id") as string;
            panelTicket._name = panelTicketDB.get("name") as string;
            panelTicket._description = panelTicketDB.get("description") as string;
            panelTicket._roles = JSON.parse(panelTicketDB.get("roles") as string ? panelTicketDB.get("roles") as string : "[]");
            panelTicket._category = panelTicketDB.get("category") as string;
            panelTicket._transcriptChannel = panelTicketDB.get("transcript_channel") as string;
            panelTicket._sendChannel = panelTicketDB.get("send_channel") as string;
            panelTicket._status = panelTicketDB.get("status") as PanelTicketEnum;
            panelTicket._fkGuild = panelTicketDB.get("fkGuild") as string;
            panelTicket._fkUser = panelTicketDB.get("fkUser") as string;
            panelTickets.push(panelTicket);
        }
        return panelTickets;
    }

    public static getLengthPanelTicketByUserAndGuild(userId: string, guildId: string): Promise<number> {
        return PanelTicketModel.count({ where: { fkUser: userId, fkGuild: guildId } });
    }
        

    public static async getPanelTicketByUserAndGuild(userId: string, guildId: string, status: PanelTicketEnum = PanelTicketEnum.DRAFT): Promise<PanelTicketHandler | null> {
        const panelTicket = new PanelTicketHandler();
        const panelTicketDB = await PanelTicketModel.findOne({ where: { fkUser: userId, fkGuild: guildId, status: status } });
        if (!panelTicketDB) { return null; }
        panelTicket._id = panelTicketDB.get("id") as string;
        panelTicket._name = panelTicketDB.get("name") as string;
        panelTicket._description = panelTicketDB.get("description") as string;
        panelTicket._roles = JSON.parse(panelTicketDB.get("roles") as string ? panelTicketDB.get("roles") as string : "[]");
        panelTicket._category = panelTicketDB.get("category") as string;
        panelTicket._transcriptChannel = panelTicketDB.get("transcript_channel") as string;
        panelTicket._sendChannel = panelTicketDB.get("send_channel") as string;
        panelTicket._status = panelTicketDB.get("status") as string;
        panelTicket._fkGuild = panelTicketDB.get("fkGuild") as string;
        panelTicket._fkUser = panelTicketDB.get("fkUser") as string;7
        return panelTicket;
    }

    public static async createPanelTicket(userId: string, guildId: string, name: string, status: PanelTicketEnum = PanelTicketEnum.DRAFT): Promise<PanelTicketHandler | null> {
        const panelTicket = new PanelTicketHandler();
        const panelTicketDB = await PanelTicketModel.create({ fkUser: userId, fkGuild: guildId, name: name, status: status });
        if (!panelTicketDB) { return null; }
        panelTicket._id = panelTicketDB.get("id") as string;
        panelTicket._name = panelTicketDB.get("name") as string;
        panelTicket._description = panelTicketDB.get("description") as string;
        panelTicket._roles = JSON.parse(panelTicketDB.get("roles") as string ? panelTicketDB.get("roles") as string : "[]");
        panelTicket._category = panelTicketDB.get("category") as string;
        panelTicket._transcriptChannel = panelTicketDB.get("transcript_channel") as string;
        panelTicket._sendChannel = panelTicketDB.get("send_channel") as string;
        panelTicket._status = panelTicketDB.get("status") as string;
        panelTicket._fkGuild = panelTicketDB.get("fkGuild") as string;
        panelTicket._fkUser = panelTicketDB.get("fkUser") as string;
        return panelTicket;
    }

    public async updatePanelTicket(name: string, description: string): Promise<boolean> {
        const panelTicketDB = await PanelTicketModel.findOne({ where: { id: this._id } });
        if (!panelTicketDB) { return false; }
        panelTicketDB.set("name", name);
        panelTicketDB.set("description", description);
        this._name = name;
        this._description = description;
        await panelTicketDB.save();
        return true;
    }

    public async updatePanelTicketRoles(roles: string[]): Promise<boolean> {
        const panelTicketDB = await PanelTicketModel.findOne({ where: { id: this._id } });
        if (!panelTicketDB) { return false; }
        panelTicketDB.set("roles", JSON.stringify(roles));
        this._roles = roles;
        await panelTicketDB.save();
        return true;
    }

    public async updatePanelTicketCategory(category: string): Promise<boolean> {
        const panelTicketDB = await PanelTicketModel.findOne({ where: { id: this._id } });
        if (!panelTicketDB) { return false; }
        panelTicketDB.set("category", category);
        this._category = category;
        await panelTicketDB.save();
        return true;
    }

    public async updatePanelTicketTranscriptChannel(transcriptChannel: string): Promise<boolean> {
        const panelTicketDB = await PanelTicketModel.findOne({ where: { id: this._id } });
        if (!panelTicketDB) { return false; }
        panelTicketDB.set("transcript_channel", transcriptChannel);
        this._transcriptChannel = transcriptChannel;
        await panelTicketDB.save();
        return true;
    }

    public async updatePanelTicketSendChannel(sendChannel: string): Promise<boolean> {
        const panelTicketDB = await PanelTicketModel.findOne({ where: { id: this._id } });
        if (!panelTicketDB) { return false; }
        panelTicketDB.set("send_channel", sendChannel);
        this._sendChannel = sendChannel;
        await panelTicketDB.save();
        return true;
    }

    public async updatePanelTicketStatus(status: PanelTicketEnum): Promise<boolean> {
        const panelTicketDB = await PanelTicketModel.findOne({ where: { id: this._id } });
        if (!panelTicketDB) { return false; }
        panelTicketDB.set("status", status);
        this._status = status;
        await panelTicketDB.save();
        return true;
    }

    public async updatePanelTicketFkGuild(fkGuild: string): Promise<boolean> {
        const panelTicketDB = await PanelTicketModel.findOne({ where: { id: this._id } });
        if (!panelTicketDB) { return false; }
        panelTicketDB.set("fk_guild", fkGuild);
        this._fkGuild = fkGuild;
        await panelTicketDB.save();
        return true;
    }

    public async updatePanelTicketFkUser(fkUser: string): Promise<boolean> {
        const panelTicketDB = await PanelTicketModel.findOne({ where: { id: this._id } });
        if (!panelTicketDB) { return false; }
        panelTicketDB.set("fk_user", fkUser);
        this._fkUser = fkUser;
        await panelTicketDB.save();
        return true;
    }

    public async updatePanelTicketName(name: string): Promise<boolean> {
        const panelTicketDB = await PanelTicketModel.findOne({ where: { id: this._id } });
        if (!panelTicketDB) { return false; }
        panelTicketDB.set("name", name);
        this._name = name;
        await panelTicketDB.save();
        return true;
    }

    public async updatePanelTicketDescription(description: string): Promise<boolean> {
        const panelTicketDB = await PanelTicketModel.findOne({ where: { id: this._id } });
        if (!panelTicketDB) { return false; }
        panelTicketDB.set("description", description);
        this._description = description;
        await panelTicketDB.save();
        return true;
    }

    public async deletePanelTicket(): Promise<boolean> {
        const panelTicketDB = await PanelTicketModel.findOne({ where: { id: this._id } });
        if (!panelTicketDB) { return false; }
        await panelTicketDB.destroy();
        return true;
    }
}