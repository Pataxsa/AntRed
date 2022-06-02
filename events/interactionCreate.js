const cmdCooldown = {};
const options = {};

module.exports = class {
	constructor (client) {
		this.client = client;
	}

	async run (interaction) {
        if (interaction.isModalSubmit()) {
            if(interaction.customId == "ModalReport"){
                const ReasonReport = interaction.fields.getTextInputValue('ReasonReportInput');
                const DetailReport = interaction.fields.getTextInputValue('DetailReportInput');
                interaction.reply({ content: "Your report has been sended !", ephemeral: true});
                if(options["picture"] != null){
                    interaction.channel.send("User: " + options["reported_user"].username + "\nReason: " + ReasonReport + "\nDetail: " + DetailReport + "\nPicture: " + options["picture"].attachment)
                }else{
                    interaction.channel.send("User: " + options["reported_user"].username + "\nReason: " + ReasonReport + "\nDetail: " + DetailReport)
                }
            }
        }

        if (!interaction.isCommand()) return;

        const data = {};
        const client = this.client;

        if(interaction.guild){
            const guild = await client.findOrCreateGuild({ id: interaction.guild.id });
			interaction.guild.data = data.guild = guild;
            
            const memberData = await client.findOrCreateMember({ id: interaction.member.id, guildID: interaction.guild.id });
			data.memberData = memberData;
        }

        const userData = await client.findOrCreateUser({ id: interaction.user.id });
		data.userData = userData;

        const botData = await client.findOrCreateBot({ id: client.config.id });
        data.botData = botData;

        const cmd = client.slashcommands.get(interaction.commandName);

        if(cmd.conf.premiumOnly && !data.guild.plugins.premium){
			return interaction.reply(client.translate("misc:NO_PREMIUM"));
		}

        let neededPermissions = [];
        if(!cmd.conf.botPermissions.includes("EMBED_LINKS")){
            cmd.conf.botPermissions.push("EMBED_LINKS");
        }
        cmd.conf.botPermissions.forEach((perm) => {
            if(!interaction.channel.permissionsFor(interaction.member).has(perm)){
                neededPermissions.push(perm);
            }
        });
        if(neededPermissions.length > 0){
            return interaction.reply(client.translate("misc:MISSING_BOT_PERMS", {
                list: neededPermissions.map((p) => `\`${p}\``).join(", ")
            }));
        }
        neededPermissions = [];
        cmd.conf.memberPermissions.forEach((perm) => {
            if(!interaction.channel.permissionsFor(interaction.member).has(perm)){
                neededPermissions.push(perm);
            }
        });
        if(neededPermissions.length > 0){
            return interaction.reply(client.translate("misc:MISSING_MEMBER_PERMS", {
                list: neededPermissions.map((p) => `\`${p}\``).join(", ")
            }));
        }

        if(!interaction.channel.nsfw && cmd.conf.nsfw){
            return interaction.reply(client.translate("misc:NSFW_COMMAND"));
        }

        if(!cmd.conf.enabled){
			return interaction.reply(client.translate("misc:COMMAND_DISABLED"));
		}

		if(cmd.conf.ownerOnly && interaction.user.id !== client.config.owner.id){
			return interaction.reply(client.translate("misc:OWNER_ONLY"));
		}

        let uCooldown = cmdCooldown[interaction.user.id];
		if(!uCooldown){
			cmdCooldown[interaction.user.id] = {};
			uCooldown = cmdCooldown[interaction.user.id];
		}
		const time = uCooldown[cmd.help.name] || 0;
		if(time && (time > Date.now())){
			return interaction.reply(client.translate("misc:COOLDOWNED", {
				seconds: Math.ceil((time-Date.now())/1000)
			}));
		}
		cmdCooldown[interaction.user.id][cmd.help.name] = Date.now() + cmd.conf.cooldown;

		if(interaction.guild) {
			client.logger.log(`${interaction.guild.name} | ${interaction.user.username} (${interaction.user.id}) a éxécuté la commande slash ${cmd.help.name}`, "cmd");
		}

        try {
            cmd.run(interaction, data, cmd, options)
        } catch(e){}
    }
}