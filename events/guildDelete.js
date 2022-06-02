const Discord = require("discord.js");

module.exports = class {

	constructor (client) {
		this.client = client;
	}
    
	async run (guild) {
        
		// Sends log embed in the logs channel
		const embed = new Discord.MessageEmbed()
			.setTitle("Remove")
			.setAuthor(guild.name, guild.iconURL())
			.setColor("#B22222")
			.addField("Name", guild.name)
			.addField("Id", guild.id)
			.addField("Owner", `${guild.owner.user.tag} (${guild.owner.id})`)
			.addField("Members", guild.members.cache.size)
			.addField("Users", guild.members.cache.filter((m) => !m.user.bot).size)
			.addField("Bots", guild.members.cache.filter((m) => m.user.bot).size)
		this.client.channels.cache.get(this.client.config.support.logs).send(embed);

	}
};  