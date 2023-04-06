import { UserModel } from "../database/models/user.db.model";

export class User {
	private _id: number = 0;
	private _username: string = "";
	
	public get id(): number {
		return this._id;
	}

	public get username(): string {
		return this._username;
	}

	public static async getUserById(id: number): Promise<User | null> {
		const user = new User();
		const userDB = await UserModel.findOne({ where: { id: id } });
		if (!userDB) { return null; }
		user._id = userDB.get("id") as number;
		user._username = userDB.get("username") as string;
		return user;
	}

	public static async getUserByUsername(username: string): Promise<User | null> {
		const user = new User();
		const userDB = await UserModel.findOne({ where: { username: username } });
		if (!userDB) { return null; }
		user._id = userDB.get("id") as number;
		user._username = userDB.get("username") as string;
		return user;
	}

	public static async createUser(id: number, username: string): Promise<User | null> {
		const user = new User();
		const userDB = await UserModel.create({ id: id, username: username });
		if (!userDB) { return null; }
		user._id = userDB.get("id") as number;
		user._username = userDB.get("username") as string;
		return user;
	}

	public static async deleteUser(id: number): Promise<boolean> {
		const userDB = await UserModel.destroy({ where: { id: id } });
		if (!userDB) { return false; }
		return true;
	}
}