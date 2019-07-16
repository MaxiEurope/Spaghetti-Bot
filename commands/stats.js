const {
    RichEmbed
} = require('discord.js'); //die klasse 'RichEmbed' aus djs nehmen
const moment = require("moment")
require("moment-duration-format");
module.exports = {
    name: 'stats',
    aliases: ['stat', 'botinfo', 'botstats'],
    description: 'Get some info about the bot, server and about you.',
    cooldown: 5,
    id: 13,
    async execute(bot, message) {

        const duration = moment.duration(bot.uptime).format(" D [days], H [hrs], m [mins], s [secs]"); //uptime
        const game = message.author.presence.game || "🚫";
        let newStats = bot.guilds.size + 723;

        let embed = new RichEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL)
            .addField('**Bot information** 🤖',
                `**Uptime:** ${duration} \n**Ping:** ${Math.round(bot.ping)}ms \n**Servers/Users:** ${newStats}/${bot.users.size.toLocaleString()}\n\n`, true)
            .addField('**User information:** 👫',
                `**Tag:** ${message.author.tag}\n**ID:** ${message.author.id}\n**Status:** ${message.author.presence.status}\n**Game:** ${game}\n\n`, true)
            .addField('**Server Information:** 🏡\n',
                `**Name/ID:** ${message.guild.name}**/**${message.guild.id}\n` +
                `**Members/Roles:** ${message.guild.memberCount}**/**${message.guild.roles.size.toLocaleString()}\n` +
                `**Owner/ID:** ${message.guild.owner}**/**${message.guild.ownerID}\n` +
                `**Channels/Region:** ${message.guild.channels.size.toLocaleString()}/${message.guild.region}`, true)
            .setColor('#00ff00')
            .setTimestamp();
        message.channel.send(embed);

    },
};