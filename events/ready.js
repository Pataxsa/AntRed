const chalk = require("chalk");

module.exports = class {

	constructor (client) {
		this.client = client;
	}

	async run () {
		const client = this.client;
		const botData = await client.findOrCreateBot({ id: client.config.id });

		client.logger.log(`Chargement au total de ${client.slashcommands.size} commande(s).`, "log");
		client.logger.log(`${client.user.tag}, prêts a servir ${client.users.cache.size} utilisateurs dans ${client.guilds.cache.size} serveurs.`, "ready");

		if(client.config.dashboard.enabled){
			client.dashboard.load(client);
		}

		const status = require("../config.js").status,
			version = require("../package.json").version;
		let i = 0;
		setInterval(function(){
			const toDisplay = status[parseInt(i, 10)].name.replace("{serversCount}", client.guilds.cache.size).replace("{usersCount}", client.users.cache.size).replace("{blacklist}", botData.blacklist.length)+" | v"+version;
			client.user.setActivity(toDisplay, {type: status[parseInt(i, 10)].type});
			if(status[parseInt(i+1, 10)]) i++;
			else i = 0;
		}, 20000);

		setTimeout(() => {
			console.log(chalk.magenta("\n\nJe suis prêt !"));
		}, 400);
	}
};