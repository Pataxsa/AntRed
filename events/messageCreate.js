const { MessageActionRow, MessageButton } = require('discord.js');
const { NlpManager } = require('node-nlp');

module.exports = class {
	constructor (client) {
		this.client = client;
	}

	async run (message) {
        if(!message.author.bot){
            const manager = new NlpManager({ languages: ['en'], forceNER: true });
            // Adds the utterances and intents for the NLP
            manager.addDocument('en', 'goodbye for now', 'greetings.bye');
            manager.addDocument('en', 'bye bye take care', 'greetings.bye');
            manager.addDocument('en', 'okay see you later', 'greetings.bye');
            manager.addDocument('en', 'bye for now', 'greetings.bye');
            manager.addDocument('en', 'i must go', 'greetings.bye');
            manager.addDocument('en', 'hello', 'greetings.hello');
            manager.addDocument('en', 'hi', 'greetings.hello');
            manager.addDocument('en', 'howdy', 'greetings.hello');
            manager.addDocument('en', 'how old are you ?', 'questions.age');
    
            // Train also the NLG
            manager.addAnswer('en', 'greetings.bye', 'Till next time');
            manager.addAnswer('en', 'greetings.bye', 'see you soon!');
            manager.addAnswer('en', 'greetings.hello', 'Hey there!');
            manager.addAnswer('en', 'greetings.hello', 'Greetings!');
            manager.addAnswer('en', 'questions.age', 'I am 20 years old');
            manager.addAnswer('en', 'questions.age', 'I am 20');
            manager.addAnswer('en', 'questions.age', "I am a robot, i don't have a age");
    
            // Train and save the model.
            await manager.train();
            manager.save();
            manager.process('en', message.content).then(response => {
                message.reply(response.answer);
            })

            if(message.content.match(new RegExp(`^<@!?${this.client.user.id}>( |)$`))){
                const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setLabel("👍 Invite me !")
                        .setURL("https://discord.com/api/oauth2/authorize?client_id=965543186590228490&permissions=8&scope=bot%20applications.commands")
                        .setStyle('LINK'),
                );

                message.reply({content: "I only work with / commands\nIf you have a problem with slash commands reinvite me !", components: [row]})
            }
        }
    }
}