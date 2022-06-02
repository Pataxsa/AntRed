const Discord = require("discord.js");

module.exports = class {

	constructor (client) {
		this.client = client;
	}
    
	async run (guild, data) {
		if(this.client.config.proMode){
			if((!this.client.config.proUsers.includes(guild.ownerID) || this.guilds.filter((g) => g.ownerID === guild.ownerID) > 1) && guild.ownerID !== this.client.config.owner.id){
				this.client.logger.log(guild.ownerID+" a tente d'inviter Protector sur son serveur.");
				return guild.leave();
			}
		}

		console.log(guild)
        
		guild = await guild.fetch();

		const messageOptions = {};

		const thanksEmbed = new Discord.MessageEmbed()
			.setAuthor("Thank you for adding me to your guild !")
			.setDescription("To configure me, type `"+this.client.config.prefix+"help` and look at the administration commands!\nTo change the language, type `"+this.client.config.prefix+"setlang [language]`.")
			.setColor(this.client.config.embed.color)
			.setFooter(this.client.config.embed.footer)
			.setTimestamp();
		messageOptions.embed = thanksEmbed;

		guild.owner.send(messageOptions).catch(() => {});

		const logsEmbed = new Discord.MessageEmbed()
			.setTitle("Add")
			.setAuthor(guild.name, guild.iconURL())
			.setColor("#32CD32")
			.addField("Name", guild.name)
			.addField("Id", guild.id)
			.addField("Owner", `${guild.owner.user.tag} (${guild.owner.id})`)
			.addField("Members", guild.members.cache.size)
			.addField("Users", guild.members.cache.filter((m) => !m.user.bot).size)
			.addField("Bots", guild.members.cache.filter((m) => m.user.bot).size)
		this.client.channels.cache.get(this.client.config.support.logs).send(logsEmbed);
        
	}
};  