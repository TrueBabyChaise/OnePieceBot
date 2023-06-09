import { BoatModel } from "../models/boat.db.model";

export class BoatHandler {
    public static async getBoat(id: string): Promise<BoatHandler> {
        return await BoatModel.findByPk(id);
    }

    public static async getBoats(): Promise<BoatHandler[]> {
        return await BoatModel.findAll();
    }

    public static async getBoatsByUser(id: string): Promise<BoatHandler[]> {
        return await BoatModel.findAll({
            where: {
                fkUser: id,
            }
        });
    }

    public static async createBoat(
        name: string,
        place: string,
        speed: number,
        durability: number,
        special: string,
        fkUser: string,
    ): Promise<BoatModel> {
        return await BoatModel.create({
            name,
            place,
            speed,
            durability,
            special,
            fkUser,
        });
    }

    public static async updateBoat(
        id: string,
        name: string,
        place: string,
        speed: number,
        durability: number,
        special: string,
    ): Promise<BoatModel> {
        const boat = await BoatModel.findByPk(id);
        boat.name = name;
        boat.place = place;
        boat.speed = speed;
        boat.durability = durability;
        boat.special = special;
        return await boat.save();
    }

    public static async deleteBoat(id: string): Promise<void> {
        const boat = await BoatModel.findByPk(id);
        await boat.destroy();
    }
}