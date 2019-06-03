const { prefix } = require('../config/config.json');
const { RichEmbed } = require('discord.js');

module.exports = {
	name: 'help',
	description: 'List all of my commands or info about a specific command.',
	aliases: ['commands'],
	usage: '<command-name>',
	cooldown: 1,
	async execute(bot, message, args) {
		let embed = new RichEmbed();
		const { commands } = message.client;

		if (!args.length) {
			embed.setAuthor('Here\'s a list of my commands', bot.user.displayAvatarURL)
			.setDescription(commands.map(command => command.name).join(', '))
            .setFooter(`You can use \`${prefix}help <command name>\` to get info about a command.`)
            .setColor('#00ff00')
            .setTimestamp();

			return message.channel.send(embed);
		}

		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		if (!command) {
            return message.channel.send('🚫 **| '+name+'** is not a valid command.\n'+
            '📢 **|** Available commands: **'+commands.map(cmd => cmd.name).join(', ')+'**');
		}

        embed.setAuthor(`Name: ${command.name}`, bot.user.displayAvatarURL);

		if (command.aliases) embed.addField('Aliases: 🏷',  `${command.aliases.join(', ')}`);
		if (command.description) embed.addField('Description: 📋', `${command.description}`);
		if (command.usage) embed.addField('Usage: 🔋', `${prefix}${command.name} ${command.usage}`);

        embed.addField('Cooldown: ⏰', `${command.cooldown || 3} second(s)`)
        .setColor('#00ff00')
        .setTimestamp();

		message.channel.send(embed);
	},
};