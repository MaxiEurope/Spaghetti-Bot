const Discord = require('discord.js-light');
const moment = require('moment');

module.exports = {
    name: 'stats',
    aliases: ['stat', 'botinfo', 'botstats'],
    description: 'View bot/server/user stats.',
    cooldown: 5,
    async execute(bot, message) {

        const duration = moment.duration(bot.uptime).format(' D [D], H [H], m [M], s [S]');
        const createdAt = moment(message.author.createdTimestamp).format('MMM Do YY, h:mm a');

        let game = 'nothing';
        if (message.author.presence.activities.length > 0) {
            game = message.author.presence.activities[0].name;
        }

        const embed = new Discord.MessageEmbed()
            .addField('🤖 Bot stats',
                `Uptime: \`${duration}\`\n` +
                `Ping: \`${(bot.ws.ping)}ms\`\n` +
                `Total servers: \`${bot.guilds.cache.size}\`\n` +
                `Cached users: \`${bot.users.cache.size}\`\n`+
                `RAM usage: \`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB / 500 MB\``, true)
            .addField('🏡 Server stats \n',
                `Name: ${message.guild.name}\n` +
                `ID: \`${message.guild.id}\`\n` +
                `Total members: \`${message.guild.memberCount}\`\n` +
                `Total roles: \`${message.guild.roles.cache.size}\`\n` +
                `Server owner: ${message.guild.owner} (\`${message.guild.ownerID}\`)\n` +
                `Region: \`${message.guild.region}\``, true)
            .addField('👫 User stats ',
                `Name: \`${message.author.tag}\`\n` +
                `ID: \`${message.author.id}\`\n` +
                `Account created: **${createdAt}**\n` +
                `Game: **${game}**`, false)
            .setColor('#00ff00');
        message.reply(embed).catch(() => {});

    },
};