/**
 * Welcome! This is spaghetti bot!
 */

/* eslint-disable no-undef */
require('dotenv').config(); //.env file loading
//djs client
const Discord = require('discord.js'); //main module for our bot
const bot = new Discord.Client({ //the discord client
    fetchAllMembers: true
});
bot.commands = new Discord.Collection();
//other
const fs = require('fs');
const config = require('./config/config.json');
const disableCommand = require('./util/disableCommand.js');
const Vote = require('./util/voteHandler.js');
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://maxi:' + process.env.MONGO_PASS + '@cluster0-bk46m.mongodb.net/test', {
    useNewUrlParser: true
});
const Guild = require('./util/mongo/guild.js'); //guild database - prefix
const Channel = require('./util/mongo/channel.js'); //channel database - disabled commands
const Profile = require('./util/mongo/profile.js'); //profile database - xp
/**
 * we read the ./commands directory and filter files which name ends with .js
 * load and set them into the commands collection
 */
const cmdf = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of cmdf) {
    const command = require(`./commands/${file}`);
    bot.commands.set(command.name, command);
}
/**
 * command and xp cooldown
 */
let cooldowns = new Discord.Collection();
let xpCooldowns = new Set(); // xp only once per minute

bot.login(process.env.TOKEN); //login

/** server */ 
const express = require('express');
const app = express();
app.get("/", (request, response) => {
    console.log("📋 " + Date.now() + " ping received");
    response.sendStatus(200);
});
const listener = app.listen(process.env.PORT, function () {
    console.log('Server is listening on port ' + listener.address().port);
});
const server = require('./server.js');
server.server();

/**
 * Discord Bot list webhook
 */
const DBL = require('dblapi.js');
const dbl = new DBL(process.env.DBL, {
    webhookServer: listener,
    webhookAuth: process.env.DBLAUTH
});
dbl.webhook.on('ready', () => {
    console.log('DBL - Webhook ready.');
});
dbl.webhook.on('vote', vote => {
    Vote.handler(dbl, bot, vote); //voteHanlder
})

/** Bot ready event */
bot.once('ready', () => {
    console.log(bot.user.username + ' is online!');
    bot.user.setActivity('boiling spaghetti | -help', {
        type: 'LISTENING'
    }); //Playing 'game'
    setInterval(async () => {
        dbl.postStats(bot.guilds.size);
        console.log('Servercount posted!');
    }, 900000);
})
/** Bot guildCreate event */
bot.on("guildCreate", (guild) => { //new guild
    let owner = bot.users.get('393096318123245578');
    owner.send(`📥**name: ${guild.name} | ID: ${guild.id}**\n` +
        `👫**members: ${guild.memberCount}**\n` +
        `🏡**owner: ${bot.users.get(guild.ownerID).username} | ${guild.ownerID} | ${guild.owner}**`);
});
/** Bot guildDelete event */
bot.on("guildDelete", (guild) => { //guild left
    let owner = bot.users.get('393096318123245578');
    owner.send(`📤**name: ${guild.name} | ID: ${guild.id}**\n` +
        `👫**members: ${guild.memberCount}**\n` +
        `🏡**owner: ${bot.users.get(guild.ownerID).username} | ${guild.ownerID} | ${guild.owner}**`);
});
/** Bot message event */
bot.on('message', async message => {
    /**
     * basic things
     */
    if (message.author.bot) return; //if bot, return
    if (message.channel.type === 'dm') return console.log('New message from ' + message.author.username + ': ' + message.content + ''); //if channel type dm, return
    /**
     * xp system
     */
    Profile.findOne({
        userID: message.author.id
    }, (err, profile) => {
        if (err) console.log(err);
        if (!profile) {
            //ignore, user has to create profile by using the profile command
        } else if (profile.xp >= 0) {
            let isOnCooldown;
            if (xpCooldowns.has(message.author.id)) {
                isOnCooldown = true;
                //no xp, cooldown
            } else {
                xpCooldowns.add(message.author.id); //add cooldown
                let randomXp = Math.round(Math.random() * (25 - 15 + 1) + 15); //random xp 15-25
                if (profile.xp + randomXp < ((5 * (Math.pow(profile.lvl, 2))) + (50 * profile.lvl) + 100)) {
                    profile.xp = profile.xp + randomXp; //add xp to user profile
                    profile.save().catch(err => console.log(err)); //save
                } else { //level up
                    profile.xp = 0;
                    if (profile.lvlupMessage === true) { // optional - send message if enabled in profile settings
                        let lvlUp = new Discord.RichEmbed()
                            .setAuthor('Level Up!', message.author.displayAvatarURL)
                            .setDescription(message.author + ' is now level ' + (profile.lvl + 1))
                            .setColor(profile.color)
                            .setFooter('Edit: -profile settings');
                        message.channel.send(lvlUp);
                    }
                    profile.lvl = profile.lvl + 1; //+ 1 level
                    profile.save().catch(err => console.log(err));
                }
                isOnCooldown = false;
            }
            if (isOnCooldown === false) {
                setTimeout(() => {
                    xpCooldowns.delete(message.author.id); //delete xp cooldown
                }, 60000); //allow giving xp every minute
            }
        }
    })
    /**
     * guild prefix function
     */
    let prefixes = [config.prefix]; //new array
    Guild.findOne({
        serverID: message.guild.id
    }, (err, guild) => {
        if (err) console.log(err);
        if (!guild || guild.active === false) {
            prefixes.push(config.prefix);
        } else {
            prefixes.push(guild.prefix);
        }
        let prefixnum;
        if (!message.content.startsWith(prefixes[0]) && !message.content.startsWith(prefixes[1])) return; //if no prefix in message, return
        if (message.content.startsWith(prefixes[0])) prefixnum = prefixes[0].length; //if prefix = '-', get length
        else if (message.content.startsWith(prefixes[1])) prefixnum = prefixes[1].length; //if guild prefix, get length
        let args = message.content.slice(prefixnum).trim().split(/ +/g), //args, an array
            commandName = args.shift().toLowerCase(), //take an argument from the array and lowercase it
            command = bot.commands.get(commandName) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName)); //get commandname or aliases
        if (!command) return; //if no command found, return
        /**
         * Channel disable command
         */
        const commandID = command.id;
        Channel.findOne({
            channelID: message.channel.id
        }, (err, cchannel) => {
            if (err) console.log(err);
            if (!cchannel) {
                //nichts
            } else {
                if (disableCommand.cDisabled(cchannel, commandID) === true) {
                    return message.channel.send('🚫 **That command is disabled in this channel.**').then(m => {
                        m.delete(4000);
                    })
                }
            }
            /**
             * command cooldown function
             */
            if (!cooldowns.has(command.name)) { //if no command cooldown...
                cooldowns.set(command.name, new Discord.Collection()); //...add one!
            }
            const now = Date.now(); //now...
            const timestamps = cooldowns.get(command.name); //...we take the command cooldown...
            const cooldownAmount = (command.cooldown || 3) * 1000; //...multiply with 1000 (ms), if no command cooldown, default 3 seconds

            if (timestamps.has(message.author.id)) { //if cooldown...
                const expirationTime = timestamps.get(message.author.id) + cooldownAmount; //...take time...

                if (now < expirationTime) {
                    const timeLeft = (expirationTime - now) / 1000;
                    return message.channel.send(`🚫 **${message.author.username}**, calm down 😓! **${timeLeft.toFixed(2)}** second(s) left.`).then(m => { //return
                        m.delete(3500); //delete message after 3.5 seconds
                    })
                }
            }

            timestamps.set(message.author.id, now); //set cooldown, if user has no cooldown
            setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

            /**
             * run command function
             */
            try {
                command.execute(bot, message, args); //try executing command
            } catch (error) {
                console.error(error); //if error, console it
                message.reply('an error occured! Please contact our staff!');
            }
        })
    })
})

/** Bot error event */
bot.on('error', err => {
    console.log(err); //catch
})

/** Process uncaughtException event */
process.on('uncaughtException', function (exception) {
    console.log(exception);
});