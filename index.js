/**
 * 
 * Spaghetti bot for discord lol
 * 
 */
const DEBUG = false;
require('dotenv').config();
require('moment-duration-format');
/** load modules */
const fs = require('fs');
const topgg = require('@top-gg/sdk');
const bfd = require('bfdapi.js');
const util = require('./src/util/util.js');
/** discord + client */
const Discord = require('discord.js-light');
/** use new reply feature */
Discord.Structures.extend('Message', Message => {
    class ExtendedMessage extends Message {
        reply(...args) {
            const apiMessage = Discord.APIMessage.create(this.channel, ...args).resolveData();
            apiMessage.data.message_reference = {
                message_id: this.id,
                guild_id: this.guild.id
            };
            apiMessage.data.allowed_mentions = {
                ...(apiMessage.data.allowed_mentions || {}),
                replied_user: apiMessage.options.ping || false
            };
            return this.channel.send(apiMessage);
        }
    }
    return ExtendedMessage;
});
/** client */
const bot = new Discord.Client({
    cacheChannels: false,
    cacheEmojis: false,
    cacheGuilds: true,
    cacheOverwrites: false,
    cachePresences: false,
    cacheRoles: true,
    fetchAllMembers: true,
    messageSweepInterval: 15,
    messageCacheMaxSize: 0,
    disableMentions: 'all',
    ws: {
        intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS']
    },
    presence: {
        activity: {
            name: 'sp!help 🍝',
            type: 'WATCHING'
        }
    },
    disabledEvents: [
        'GUILD_ROLE_CREATE', 'GUILD_ROLE_UPDATE', 'GUILD_ROLE_DELETE', 'CHANNEL_CREATE', 'CHANNEL_UPDATE', 'CHANNEL_DELETE', 'CHANNEL_PINS_UPDATE', 'MESSAGE_DELETE', 'MESSAGE_DELETE_BULK'
    ]
});
bot.login(DEBUG ? process.env.DEBUG_DISCORD_TOKEN : process.env.DISCORD_TOKEN).catch(e => util.log(e));
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
mongoose.connect(`mongodb+srv://maxi:${process.env.MONGO_PASS}@${process.env.MONGO_CLUSTER}.mongodb.net/test`, {
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
bot.guildPrefixes = new Map();
/** 
 * bot events
 */
/** ready */
bot.once('ready', async () => {
    util.log(`${bot.user.tag} is now online!`);
    await bot.users.fetch('393096318123245578', true);
    /** load prefixes */
    bot.guilds.cache.forEach(async g => {
        const _prefix = await util.getPrefix(g.id);
        if (_prefix) {
            bot.guildPrefixes.set(g.id, _prefix);
        }
    });
    /** vote clients */
    bot.topggClient = new topgg.Api(process.env.TOPGG_TOKEN);
    bot.bfdClient = new bfd('585142238217240577', process.env.BFD_TOKEN);
    /** vote handler & post server count */
    vote.handler(bot);
    setInterval(() => {
        bot.topggClient.postStats({
            serverCount: bot.guilds.cache.size
        }).then(() => {
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
    const info = {
        color: '#f2bd76',
        author: {
            name: `New guild - ${guild.name} (${guild.id})`,
            icon_url: guild.iconURL({dynamic: true})
        },
        description: `👫 **Member count: ${guild.memberCount}**\n👑 **Owner: ${await (await bot.users.fetch(guild.ownerID)).tag || 'Unkown user#0000'} \`${guild.ownerID}\`**`,
        footer: {
            text: 'Created at'
        },
        timestamp: new Date(guild.createdTimestamp)
    };
    await (await bot.channels.fetch(process.env.LOG_CHANNEL)).send({embed: info});
    const _prefix = await util.getPrefix(guild.id);
    if (_prefix) {
        bot.guildPrefixes.set(guild.id, _prefix);
    }
});
/** guildDelete */
bot.on('guildDelete', async (guild) => {
    if (!guild.available) return;
    const info = {
        color: '#ee6c3e',
        author: {
            name: `Left guild - ${guild.name} (${guild.id})`,
            icon_url: guild.iconURL({dynamic: true})
        },
        description: `👫 **Member count: ${guild.memberCount}**\n👑 **Owner: ${await (await bot.users.fetch(guild.ownerID)).tag || 'Unkown user#0000'} \`${guild.ownerID}\`**`,
        footer: {
            text: 'Created at'
        },
        timestamp: new Date(guild.createdTimestamp)
    };
    await (await bot.channels.fetch(process.env.LOG_CHANNEL)).send({embed: info});
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
                    if (res.lvlupMessage === true && message.guild.id !== '264445053596991498') {
                        const embed = new Discord.MessageEmbed()
                            .setAuthor('Level Up!', message.author.displayAvatarURL({
                                dynamic: true
                            }))
                            .setDescription(`**${message.author.tag}** leveled up to lvl **${(res.lvl + 1)}**!`)
                            .setColor(res.color)
                            .setFooter('edit profile settings with: -profile settings');
                        message.reply(embed);
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
    /** add message author - testing */
    bot.users.add(message.author, true);
    /** mention */
    if (['<@585142238217240577>', '<@!585142238217240577>'].some(e => message.content === e)) return message.reply('🍝 Hello there! Run `sp!help` for a list of commands.').catch(() => {});
    /** check prefix */
    let prefix;
    let _prefixes = ['sp!', '<@585142238217240577>', '<@!585142238217240577>'];
    if (bot.guildPrefixes.has(message.guild.id)) {
        _prefixes.push(bot.guildPrefixes.get(message.guild.id));
    }
    for (const p of _prefixes) {
        if (message.content.startsWith(p)) {
            prefix = p;
            break;
        }
    }
    if (!prefix || prefix === undefined) return;
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
            await message.reply('⛔ This command has been disabled for this channel.').catch(() => {});
        }
        setTimeout(() => cmdCooldown.delete(`${message.author.id}-${cmd.name}`), commandCooldown);
    } else {
        const cd = cmdCooldown.get(`${message.author.id}-${cmd.name}`);
        if (Date.now() < cd[0]) {
            const timeLeft = (cd[0] - Date.now());
            if (cd[1] === true) return;
            cmdCooldown.set(`${message.author.id}-${cmd.name}`, [cd[0], true]);
            return message.reply(`😔 Calm down a bit and wait \`${(timeLeft/1000).toFixed(2)}\`s before using the command **${cmd.name}**!`).then(msg => {
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