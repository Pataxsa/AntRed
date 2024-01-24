const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('hello')
		.setDescription('Sends a greeting message to the user who invoked the command'),
	async execute(interaction) {
		await interaction.reply(`Hello, ${interaction.user.username}!`);
	},
};