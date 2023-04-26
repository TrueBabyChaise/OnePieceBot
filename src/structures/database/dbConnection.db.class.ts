import { Sequelize, ConnectionError, ConnectionTimedOutError, TimeoutError } from "sequelize";
import dotenv from "dotenv";
dotenv.config();
export class DBConnection {
	private static instance: DBConnection;
	private _sequelize: Sequelize;

	private constructor() {
		this._sequelize = new Sequelize(
			process.env.DB_NAME!,
			process.env.DB_USER!,
			process.env.DB_PASS,
			{
				dialect: "mariadb",
				host: process.env.DB_HOST,
				port: parseInt(process.env.DB_PORT!),
				retry: {
					max: 5,
					match: [
						ConnectionError,
						ConnectionTimedOutError,
						TimeoutError,
						/Deadlock/i,
						"SQLITE_BUSY",
					]
				},
			}
		);
	}

	public static getInstance(): DBConnection {
		if (!DBConnection.instance) {
			DBConnection.instance = new DBConnection();
		}

		return DBConnection.instance;
	}

	public get sequelize(): Sequelize {
		return this._sequelize;
	}
}