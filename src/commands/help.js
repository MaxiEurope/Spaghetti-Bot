const Discord = require('discord.js-light');

module.exports = {
    name: 'help',
    aliases: ['commands'],
    example: ['sp!help leaderboard'],
    description: 'List my commands or get some info about a specific command.',
    usage: ['sp!help (command)'],
    cooldown: 2,
    async execute(bot, message, args) {

        const embed = new Discord.MessageEmbed();

        if (!args.length) {
            embed.setAuthor('List of my commands', bot.user.displayAvatarURL())
                .addField('🗒 General', '`avatar` `help` `invite` `ping` `stats` `vote`')
                .addField('😂 Fun', '`advice` `emoji` `food`')
                .addField('💰 Economy', '`coins` `daily` `feed` `leaderboard` `slots`')
                .addField('❓ Quiz', '`quiz`')
                .addField('🖼 Profile', '`profile`')
                .addField('🖇 Util', '`enable` `disable` `prefix` `translate`')
                .setDescription('My prefix is `sp!`. Run commands with `sp!<command>`.\n' +
                    'Need help 🤔? Use `sp!help <command>`.\n' +
                    'Make sure to replace `<command>` with a command name.')
                .addField('Additional information', '◽ [Invite me](https://discord.com/oauth2/authorize?client_id=585142238217240577&scope=bot&permissions=19520) ' +
                    '◽ [Support server](https://discord.gg/adrRzgQ) ' +
                    '◽ [Vote for more coins on top.gg](https://top.gg/bot/585142238217240577/vote)')
                .addField('Latest news - 24nd jan 2021 📬', '```diff\n+ added "support" server\n- yeeted typos```')
                .setFooter('Arguments between <> are required')
                .setColor('#00ff00');
            message.reply(embed).catch(() => {});
        } else {
            const {
                commands
            } = message.client;

            const name = args[0].toLowerCase();
            const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

            if (!command) return message.reply('⛔ Command not found. Get a list of available commands by simply running `sp!help`.').catch(() => {});

            embed.setAuthor(`Help for command: ${command.name}`, bot.user.displayAvatarURL())
                .setColor('#00ff00')
                .setFooter('Arguments between <> are required, () are optional');

            if (command.aliases) embed.addField('🏷 Aliases:', `\`${command.aliases.join('` `')}\``);
            if (command.cooldown) embed.addField('⏰ Cooldown:', `\`${command.cooldown} second(s)\``);
            if (command.example) embed.addField('💡 Example:', `\`${command.example.join('`\n`')}\``);
            if (command.description) embed.addField('📋 Description:', command.description);
            if (command.usage) embed.addField('🔋 Usage:', `\`${command.usage}\``);

            message.reply(embed).catch(() => {});
        }

    },
};