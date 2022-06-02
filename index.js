require("./helpers/extenders");

const util = require("util"),
	fs = require("fs"),
	readdir = util.promisify(fs.readdir),
	mongoose = require("mongoose");

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const guildId = '827981396098154496';

const AntRed = require("./base/AntRed"),
    client = new AntRed();

const init = async () => {
	//--------------------------------
    //         SLASH COMMANDS
    //--------------------------------
	const directories = await readdir("./slashcommands/");
	client.logger.log(`Chargement au total de ${directories.length} catégories.`, "log");
	directories.forEach(async (dir) => {
		const commands = await readdir("./slashcommands/"+dir+"/");
		commands.filter((cmd) => cmd.split(".").pop() === "js").forEach((cmd) => {
			const response = client.loadSlashCommand("./slashcommands/"+dir, cmd);
			if(response){
				client.logger.log(response, "error");
			}
		});
	})
		
    //--------------------------------
    //             EVENTS
    //--------------------------------
	const evtFiles = await readdir("./events/");
	client.logger.log(`Chargement au total de ${evtFiles.length} events.`, "log");
	evtFiles.forEach((file) => {
		const eventName = file.split(".")[0];
		client.logger.log(`Chargement Event: ${eventName}`);
		const event = new (require(`./events/${file}`))(client);
		client.on(eventName, (...args) => event.run(...args));
		delete require.cache[require.resolve(`./events/${file}`)];
	});
    
	client.login(client.config.token);

    //--------------------------------
    //            DATABASE
    //--------------------------------
	mongoose.connect(client.config.mongoDB, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
		client.logger.log("Connecté a la base de données Mongodb.", "log");
	}).catch((err) => {
		client.logger.log("Impossible de se connecter a la base de données Mongodb. Erreur:"+err, "error");
	});

	const languages = require("./helpers/languages");
	client.translations = await languages();
};

init().then(s => {
    const rest = new REST({ version: '9' }).setToken(client.config.token);

    rest.put(
        Routes.applicationGuildCommands(client.config.id, guildId),
        { body: client.slashcommands.map(s => s.conf.data) },
    );
});

client.on("disconnect", () => client.logger.log("Bot is disconnecting...", "warn"))
	.on("reconnecting", () => client.logger.log("Bot reconnecting...", "log"))
	.on("error", (e) => client.channels.cache.get("911962196047720478").send(e.name))
	.on("warn", (info) => client.logger.log(info, "warn"));

process.on("unhandledRejection", (err) => {
	console.error(err);
});