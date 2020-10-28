/**
 * 
 * Spaghetti bot for discord lol
 * 
 */
require('dotenv').config();
require('moment-duration-format');
/** load modules */
const fs = require('fs');
const topgg = require('dblapi.js');
const bfd = require('bfdapi.js');
const util = require('./src/util/util.js');
/** discord + client */
const Discord = require('discord.js-light');
const bot = new Discord.Client({
    cacheChannels: false,
    cacheEmojis: false,
    cacheGuilds: true,
    cacheOverwrites: false,
    cachePresences: false,
    cacheRoles: true,
    fetchAllMembers: false,
    messageSweepInterval: 15,
    messageCacheMaxSize: 0,
    disableMentions: 'all',
    ws: {
        intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS']
    },
    presence: {
        activity: {
            name: '-help 🍝',
            type: 'LISTENING'
        }
    },
    disabledEvents: [
        'INVITE_CREATE',
        'INVITE_DELETE',
        'GUILD_MEMBER_UPDATE',
        'GUILD_MEMBER_AVAILABLE',
        'GUILD_MEMBER_SPEAKING',
        'GUILD_INTEGRATIONS_UPDATE',
        'GUILD_ROLE_CREATE',
        'GUILD_ROLE_DELETE',
        'GUILD_ROLE_UPDATE',
        'GUILD_BAN_ADD',
        'GUILD_BAN_REMOVE',
        'GUILD_EMOJIS_UPDATE',
        'CHANNEL_DELETE',
        'CHANNEL_UPDATE',
        'GUILD_EMOJI_CREATE',
        'GUILD_EMOJI_DELETE',
        'CHANNEL_PINS_UPDATE',
        'MESSAGE_DELETE',
        'MESSAGE_UPDATE',
        'MESSAGE_DELETE_BULK',
        'MESSAGE_BULK_DELETE',
        'MESSAGE_REACTION_REMOVE_ALL',
        'MESSAGE_REACTION_REMOVE_EMOJI',
        'PRESENCE_UPDATE',
        'TYPING_START',
        'TYPING_STOP',
        'VOICE_BROADCAST_SUBSCRIBE',
        'VOICE_BROADCAST_UNSUBSCRIBE',
        'VOICE_STATE_UPDATE',
        'VOICE_SERVER_UPDATE',
        'WEBHOOKS_UPDATE'
    ]
});
bot.login(process.env.DISCORD_TOKEN).catch(e => util.log(e));
/** load emojis */
bot.coin = '<:coin:770386683471331438>';
bot.clear = '<:TEclear:538475982542340163>';
bot.xp = '<:xp:771001757631381535>';
/** load commands */
bot.commands = new Discord.Collection();
const commandsInDir = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));
for (const file of commandsInDir) {
    const command = require(`./src/commands/${file}`);
    bot.commands.set(command.name, command);
}
/** mongoose */
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://maxi:' + process.env.MONGO_PASS + '@cluster0-bk46m.mongodb.net/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});
const Profile = require('./src/util/mongo/profile.js');
/** topgg / votinghandler*/
const vote = require('./src/util/vote.js');
/** cooldowns / prefixes*/
const cmdCooldown = new Map();
const xpCooldown = new Set();
const defaultPrefix = '-';
bot.guildPrefixes = new Map();
/** 
 * bot events
 */
/** ready */
bot.once('ready', () => {
    util.log(`${bot.user.tag} is now online!`);
    bot.users.fetch('393096318123245578', true);
    /** load prefixes */
    bot.guilds.cache.forEach(async g => {
        const _prefix = await util.getPrefix(g.id);
        if (_prefix) {
            bot.guildPrefixes.set(g.id, _prefix);
        }
    });
    /** vote clients */
    bot.topggClient = new topgg(process.env.TOPGG_TOKEN);
    bot.bfdClient = new bfd('585142238217240577', process.env.BFD_TOKEN);
    /** vote handler & post server count */
    vote.handler(bot, bot.topggClient);
    setInterval(() => {
        bot.topggClient.postStats(bot.guilds.cache.size).then(() => {
            util.log('Posted server count to top.gg');
        }).catch(() => {});
        bot.bfdClient.postServerCount(bot.guilds.cache.size).then(() => {
            util.log('Posted server count to botsfordiscord.com');
        }).catch(() => {});
    }, 900000);
});
/** guildCreate */
bot.on('guildCreate', async (guild) => {
    if (!guild.available) return;
    const owner = bot.users.cache.get('393096318123245578');
    owner.send(`📥**name: ${guild.name} | ID: ${guild.id}**\n` +
        `👫**members: ${guild.memberCount}**\n` +
        `👑**owner:  ${guild.owner} | ID: ${guild.ownerID}**`);
    const _prefix = await util.getPrefix(guild.id);
    if (_prefix) {
        bot.guildPrefixes.set(guild.id, _prefix);
    }
});
/** guildDelete */
bot.on('guildDelete', (guild) => {
    if (!guild.available) return;
    const owner = bot.users.cache.get('393096318123245578');
    owner.send(`📤**name: ${guild.name} | ID: ${guild.id}**\n` +
        `👫**members: ${guild.memberCount}**\n` +
        `👑**owner:  ${guild.owner} | ID: ${guild.ownerID}**`);
});
/** message */
bot.on('message', async message => {
    if (message.channel.type !== 'text') return;
    /** xp system */
    const res = await Profile.findOne({
        userID: message.author.id
    });
    if (res === null) {
        await new Profile({
            userID: message.author.id,
            xp: 0,
            totXp: 0,
            lvl: 0,
            creationDate: Date.now(),
            shortDesc: 'A spy 🕵️',
            longDesc: 'Noone knows 😱',
            color: '#00ff00',
            lvlupMessage: false
        }).save().catch(() => {});
        if (message.author.bot) return;
    } else {
        if (message.author.bot) return;
        if (res.xp >= 0) {
            if (!xpCooldown.has(message.author.id)) {
                xpCooldown.add(message.author.id);
                const rndXp = Math.round(Math.random() * (25 - 15 + 1) + 15);
                if (res.xp + rndXp < ((5 * (Math.pow(res.lvl, 2))) + (50 * res.lvl) + 100)) {
                    res.totXp = util.totXP(res.lvl, res.xp + rndXp);
                    res.xp = res.xp + rndXp;
                    await res.save().catch(() => {});
                } else {
                    if (res.lvlupMessage === true) {
                        const embed = new Discord.MessageEmbed()
                            .setAuthor('Level Up!', message.author.displayAvatarURL({
                                dynamic: true
                            }))
                            .setDescription(`**${message.author.tag}** leveled up to lvl **${(res.lvl + 1)}**!`)
                            .setColor(res.color)
                            .setFooter('edit profile settings with: -profile settings');
                        message.channel.send(embed);
                    }
                    res.totXp = util.totXP(res.lvl + 1, rndXp);
                    res.xp = rndXp;
                    res.lvl = res.lvl + 1;
                    await res.save().catch(() => {});
                }
                setTimeout(() => {
                    xpCooldown.delete(message.author.id);
                }, 60000);
            }
        }
    }
    /** check prefix */
    let prefix, prefixes = [defaultPrefix];
    if (bot.guildPrefixes.has(message.guild.id)) {
        prefixes.push(bot.guildPrefixes.get(message.guild.id));
    }
    for (const p of prefixes) {
        if (message.content.startsWith(p)) {
            prefix = p;
            break;
        }
    }
    if(!prefix) return;
    /** args */
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const commandName = args.shift().toLowerCase();
    /** get command */
    const cmd = bot.commands.get(commandName) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!cmd) return;
    /** manage command cooldowns */
    const commandCooldown = (cmd.cooldown || 3) * 1000;
    if (!cmdCooldown.has(`${message.author.id}-${cmd.name}`)) {
        cmdCooldown.set(`${message.author.id}-${cmd.name}`, [Date.now() + commandCooldown, false]);
        /** check if disabled */
        const disabled = await util.isDisabled(message.channel.id, cmd.name);
        if (!disabled) {
            /** run command */
            try {
                cmd.execute(bot, message, args);
                util.addCmd(message.author.id, 1);
            } catch (e) {
                util.log(e);
            }
        } else {
            await message.channel.send('⛔ This command has been disabled for this channel.').catch(() => {});
        }
        setTimeout(() => cmdCooldown.delete(`${message.author.id}-${cmd.name}`), commandCooldown);
    } else {
        const cd = cmdCooldown.get(`${message.author.id}-${cmd.name}`);
        if (Date.now() < cd[0]) {
            const timeLeft = (cd[0] - Date.now());
            if (cd[1] === true) return;
            cmdCooldown.set(`${message.author.id}-${cmd.name}`, [cd[0], true]);
            return message.channel.send(`😔 Calm down a bit and wait \`${(timeLeft/1000).toFixed(2)}\`s before using the command **${cmd.name}**!`).then(msg => {
                msg.delete({
                    timeout: timeLeft + 3000
                }).catch(() => {});
            }).catch(() => {});
        }
    }

});
/** error */
bot.on('error', err => {
    util.log(err);
});
/** process uncaughtException */
process.on('uncaughtException', (exception) => {
    util.log(exception.stack);
});
/** process unhandledRejection */
process.on('unhandledRejection', (rejection) => {
    util.log(rejection);
});