const SlashCommand = require("../../base/SlashCommand.js"),
    { MessageActionRow, Modal, TextInputComponent } = require("discord.js"),
    { SlashCommandBuilder } = require('@discordjs/builders');

    class Report extends SlashCommand {
        constructor (client) {
            super(client, {
                name: "report",
                dirname: __dirname,
                enabled: true,
                memberPermissions: ["MANAGE_GUILD"],
                botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
                nsfw: false,
                ownerOnly: false,
                cooldown: 1000,
                ephemeral: true,
                data: new SlashCommandBuilder()
                .setName('report')
                .setDescription('Make a report of an user !')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('The user that you want to report !')
                        .setRequired(true))
                .addAttachmentOption(option =>
                    option.setName('picture')
                        .setDescription('Send a proof !')
                        .setRequired(false)).toJSON()
            });
        }

    async run (interaction, data, cmd, options) {
        const reported_user = interaction.options._hoistedOptions[0].user;
        if(interaction.options._hoistedOptions.length != 2){
            options["picture"] = null;
        }else{
            const picture = interaction.options._hoistedOptions[1].attachment;
            options["picture"] = picture;
        }

        options["reported_user"] = reported_user;

        const modalreport = new Modal()
            .setCustomId('ModalReport')
            .setTitle('Report');
        const ReasonReportInput = new TextInputComponent()
			.setCustomId('ReasonReportInput')
			.setLabel(`Explain the reason of your report`)
            .setPlaceholder(`I am reporting ${reported_user.username} because...`)
            .setMaxLength(400)
            .setMinLength(25)
			.setStyle('PARAGRAPH');
        const DetailReportInput = new TextInputComponent()
			.setCustomId('DetailReportInput')
			.setLabel("Do you have more details about this user ?")
            .setPlaceholder(`Yes, I have more detail about ${reported_user.username}...`)
            .setMaxLength(100)
			.setStyle('SHORT');

		const ActionRow1 = new MessageActionRow().addComponents(ReasonReportInput);
		const ActionRow2 = new MessageActionRow().addComponents(DetailReportInput);

		modalreport.addComponents(ActionRow1, ActionRow2);

		await interaction.showModal(modalreport);
   };
};

module.exports = Report;