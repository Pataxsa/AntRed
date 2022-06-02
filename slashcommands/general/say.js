const SlashCommand = require("../../base/SlashCommand.js"),
    { SlashCommandBuilder } = require('@discordjs/builders');

    class Say extends SlashCommand {
        constructor (client) {
            super(client, {
                name: "say",
                dirname: __dirname,
                enabled: true,
                memberPermissions: ["MANAGE_GUILD"],
                botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
                nsfw: false,
                ownerOnly: false,
                cooldown: 1000,
                ephemeral: true,
                data: new SlashCommandBuilder()
                .setName('say')
                .setDescription('The bot replies with your custom message !')
                .addStringOption(option =>
                    option.setName('message')
                        .setDescription('The message that you want to send !')
                        .setRequired(true)).toJSON()
            });
        }

    async run (interaction, data, cmd) {
        const brain = require("brain.js");
        const net = new brain.recurrent.LSTM();

        net.train([
        { input: 'I feel great about the world!', output: 'happy' },
        { input: 'The world is a terrible place!', output: 'sad' },
        ]);

        const output = net.run('I feel great about the world!');
        console.log(output)

        interaction.channel.send(interaction.options._hoistedOptions[0].value);
        interaction.reply({ content: "Le message `" + interaction.options._hoistedOptions[0].value + "` a bien été envoyé !", ephemeral: cmd.conf.ephemeral});
   };
};

module.exports = Say;