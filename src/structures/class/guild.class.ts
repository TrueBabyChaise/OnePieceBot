import { GuildModel, GuildUserModel } from "../database/models/guild.db.model";

export class Guild {
	private _id: number = 0;
	private _name: string = "";

	public get id(): number {
		return this._id;
	}

	public get name(): string {
		return this._name;
	}

	public static async getGuildById(id: number): Promise<Guild | null> {
		const guild = new Guild();
		const guildDB = await GuildModel.findOne({ where: { id: id } });
		if (!guildDB) { return null; }
		guild._id = guildDB.get("id") as number;
		guild._name = guildDB.get("name") as string;
		return guild;
	}

	public static async getGuildByName(name: string): Promise<Guild | null> {
		const guild = new Guild();
		const guildDB = await GuildModel.findOne({ where: { name: name } });
		if (!guildDB) { return null; }
		guild._id = guildDB.get("id") as number;
		guild._name = guildDB.get("name") as string;
		return guild;
	}

	public static async createGuild(id: number, name: string): Promise<Guild | null> {
		const guild = new Guild();
		const guildDB = await GuildModel.create({ id: id, name: name });
		if (!guildDB) { return null; }
		guild._id = guildDB.get("id") as number;
		guild._name = guildDB.get("name") as string;
		return guild;
	}

	public static async deleteGuild(id: number): Promise<boolean> {
		const guildDB = await GuildModel.destroy({ where: { id: id } });
		if (!guildDB) { return false; }
		return true;
	}

	public async addUserToGuild(id: number): Promise<boolean> {
		const guildUserDB = await GuildUserModel.create({ fkUser: id, fkGuild: this._id });
		if (!guildUserDB) { return false; }
		return true;
	}

	public async getUsers(): Promise<number[]> {
		const guildUsersDB = await GuildUserModel.findAll({ where: { fkGuild: this._id } });
		if (!guildUsersDB) { return []; }
		const users: number[] = [];
		for (const guildUserDB of guildUsersDB) {
			users.push(guildUserDB.get("fkUser") as number);
		}
		return users;
	}

	public async removeUserFromGuild(id: number): Promise<boolean> {
		const guildUserDB = await GuildUserModel.destroy({ where: { fkUser: id, fkGuild: this._id } });
		if (!guildUserDB) { return false; }
		return true;
	}

	public async isUserInGuild(id: number): Promise<boolean> {
		const guildUserDB = await GuildUserModel.findOne({ where: { fkUser: id, fkGuild: this._id } });
		if (!guildUserDB) { return false; }
		return true;
	}

	public async addUsersToGuild(ids: number[]): Promise<boolean> {
		for (const id of ids) {
			const guildUserDB = await GuildUserModel.create({ fkUser: id, fkGuild: this._id });
			if (!guildUserDB) { return false; }
		}
		return true;
	}
}