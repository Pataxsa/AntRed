const path = require("path");

module.exports = class SlashCommand {
	constructor(client, {
		name = null,
		dirname = false,
		enabled = true,
		premiumOnly = false,
		botPermissions = new Array(),
		memberPermissions = new Array(),
		nsfw = false,
		ownerOnly = false,
		cooldown = 3000,
		ephemeral = false,
		data = null
	})
	{
		const category = (dirname ? dirname.split(path.sep)[parseInt(dirname.split(path.sep).length-1, 10)] : "Other");
		this.client = client;
		this.conf = { enabled, premiumOnly, memberPermissions, botPermissions, nsfw, ownerOnly, cooldown, ephemeral, data};
		this.help = { name, category };
	}
};
