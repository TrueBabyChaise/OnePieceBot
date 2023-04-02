import { Client } from "discord.js";
import { readdirSync } from "fs";

export default async (client: Client) => {
	const eventFiles = readdirSync('./src/events');
	for (const file of eventFiles) {
		const lstat = await (await import(`fs`)).promises.lstat(`./src/events/${file}`);
		if (lstat.isDirectory()) {
			const subEventFiles = readdirSync(`./src/events/${file}`).filter((file: string) => file.endsWith('event.ts'));
			for (const subFile of subEventFiles) {
				const Event = (await import(`../events/${file}/${subFile}`)).default;
				try {
					const event = new Event();
					if (event.once) {
						client.once(event.name, (...args: any) => event.execute(client, ...args));
					} else {
						client.on(event.name, (...args: any) => event.execute(client, ...args));
					}
				} catch (error) {
					console.log("Could not load event " + file + "/" + subFile + "");
				}
			}
		}
	}
}