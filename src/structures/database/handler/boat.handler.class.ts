import { BoatModel } from "../models/boat.db.model";

export class BoatStatusEnum {
    public static readonly BUILDING: string = "building";
    public static readonly WORKING: string = "working";
    public static readonly GROUNDED: string = "grounded";
    public static readonly DESTROYED: string = "destroyed";
}
export class BoatHandler {
    private _id: string = "";
    public name: string;
    public place: string;
    public speed: number;
    public isMoving: boolean;
    public durability: number;
    public special: string;
    public status: BoatStatusEnum;
    public fkUser: string;

    constructor(name: string = "", place: string = "", speed: number = 0, isMoving: boolean = false, durability: number = 100, special: string = "", status: BoatStatusEnum = BoatStatusEnum.BUILDING, fkUser: string = "") {
        this.name = name;
        this.place = place;
        this.speed = speed;
        this.isMoving = isMoving;
        this.durability = durability;
        this.special = special;
        this.status = status;
        this.fkUser = fkUser;
    }

    public get id(): string {
        return this._id;
    }

    public async save(): Promise<void> {
        if (this._id) return this.update();
        await BoatModel.create({
            name: this.name,
            place: this.place,
            speed: this.speed,
            isMoving: this.isMoving,
            durability: this.durability,
            special: this.special,
            status: this.status,
            fkUser: this.fkUser,
        }).then((boat: any) => {
            this._id = boat.id;
        });
    }

    public async update(): Promise<void> {
        await BoatModel.update({
            name: this.name,
            place: this.place,
            speed: this.speed,
            isMoving: this.isMoving,
            durability: this.durability,
            special: this.special,
            status: this.status,
            fkUser: this.fkUser,
        }, {
            where: {
                id: this._id,
            },
        });
    }

    public async delete(): Promise<void> {
        await BoatModel.destroy({
            where: {
                id: this._id,
            },
        });
    }

    public static async createBoat(name: string, place: string, speed: number, isMoving: boolean, durability: number, special: string, status: BoatStatusEnum, fkUser: string): Promise<BoatHandler> {
        const boat = new BoatHandler(name, place, speed, isMoving, durability, special, status, fkUser);
        await boat.save();
        return boat;
    }

    public static async getBoat(id: string): Promise<BoatHandler | null> {
        const boat: any = await BoatModel.findOne({
            where: {
                id: id,
            },
        });
        if (!boat) return null;
        let tmp = new BoatHandler(boat.name, boat.place, boat.speed, boat.isMoving, boat.durability, boat.special, boat.status, boat.fkUser);
        tmp._id = boat.id;
        return tmp;
    }

    public static async getBoatByName(): Promise<BoatHandler[]> {
        const boats: any = await BoatModel.findAll();
        const boatHandlers: BoatHandler[] = [];
        for (const boat of boats) {
            let tmp = new BoatHandler(boat.name, boat.place, boat.speed, boat.isMoving, boat.durability, boat.special, boat.status, boat.fkUser);
            tmp._id = boat.id;
            boatHandlers.push(tmp);
        }
        return boatHandlers;
    }

    public static async getBoatByUser(fkUser: string): Promise<BoatHandler[]> {
        const boats: any = await BoatModel.findAll({
            where: {
                fkUser: fkUser,
            },
        });
        const boatHandlers: BoatHandler[] = [];
        for (const boat of boats) {
            let tmp = new BoatHandler(boat.name, boat.place, boat.speed, boat.isMoving, boat.durability, boat.special, boat.status, boat.fkUser);
            tmp._id = boat.id;
            boatHandlers.push(tmp);
        }
        return boatHandlers;
    }

    public static async deleteBoat(name: string): Promise<void> {
        await BoatModel.destroy({
            where: {
                name: name,
            },
        });
    }
}
    