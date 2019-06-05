/**
 * Hallo Spaghetti!
 * Das ist dein discord bot. Ich werde ihn immer auf deutsch //kommentieren, die commands an sich aber englisch machen.
 * Ich könnte ihn ja auf discordbots.org submitten und du wirst bekannt 😉.
 */
require('dotenv').config(); //.env file laden
//djs client
const Discord = require('discord.js'); //modul djs laden
const bot = new Discord.Client(); //djs client erschaffen
bot.commands = new Discord.Collection(); //{commands} object
//other
const fs = require('fs'); //node filesystem
const config = require('./config/config.json'); //config file = prefix + owner
const mongoose = require('mongoose'); //unsere database
mongoose.connect('mongodb+srv://maxi:' + process.env.MONGO_PASS + '@cluster0-bk46m.mongodb.net/test', {
    useNewUrlParser: true
});
const Guild = require('./util/mongo/guild.js'); //guild database
/**
 * wir lesen das verzeichnis 'commands' und filtern alle dateien mit der endung '.js'
 * anschließend gehen wir mit einer for schleife durch alles files
 * laden sie, loggen sie und setzen sie in das commands object
 */
const cmdf = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of cmdf) {
    const command = require(`./commands/${file}`);
    bot.commands.set(command.name, command);
}
/**
 * jetzt kommt das cooldown system, eine djs collection
 */
const cooldowns = new Discord.Collection();

bot.once('ready', () => { //ready event
    console.log(bot.user.username + ' is online!'); //console
    bot.user.setActivity('boiling spaghetti', {
        type: 'LISTENING'
    }); //Playing 'game'

})

bot.on('message', async message => { //message event
    /**
     * basic sachen, wir brauchen diese, um den bot steuern zu können
     */
    if (message.author.bot) return; //wenn der user ein bot ist, nicht weiter lassen
    if (message.channel.type === 'dm') return console.log('New message from '+message.author.username+': ' + message.content + ''); //wenn und jemand eine DM schreibt, loggen
    if (message.author.id !== '393096318123245578') return;
    /**
     * Da drunter ist die custom prefix funktion.
     */
    let prefixes = [config.prefix];
    Guild.findOne({
        serverID: message.guild.id
    }, (err, guild) => {
        if (err) console.log(err);
        if (!guild) {
            prefixes.push(config.prefix);
        } else {
            prefixes.push(guild.prefix);
        }
        let prefixnum;
        if (!message.content.startsWith(prefixes[0]) && !message.content.startsWith(prefixes[1])) return; //wenn die nachricht nicht mit dem prefix beginnt, stoppen
        if (message.content.startsWith(prefixes[0])) prefixnum = prefixes[0].length; //wenn prefix '-' ist, länge herausfinden
        else if (message.content.startsWith(prefixes[1])) prefixnum = prefixes[1].length; //wenn prefix custom ist, länge herausfinden
        let args = message.content.slice(prefixnum).trim().split(/ +/g), //unsere argumente, ein einfacher array
            commandName = args.shift().toLowerCase() //ein argument vom args array wegnehmen, und alle zeichen klein machen
        command = bot.commands.get(commandName) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName)); //command namen lesen, evt aliases lesen
        if (!command) return; //wenn kein command unter diesem namen gefunden wurde, stoppen (evt user bescheid geben)
        /**
         * nun kommt das cooldown system
         */
        if (!cooldowns.has(command.name)) { //wenn der user keinen cooldown hat...
            cooldowns.set(command.name, new Discord.Collection()); //...einen für den command hinzufügen
        }
        const now = Date.now(); //jetzt...
        const timestamps = cooldowns.get(command.name); //...nehmen wir den command-cooldown...
        const cooldownAmount = (command.cooldown || 3) * 1000; //...und multiplizieren ihn mit 1000 (js verwendet millisekunden für timeouts) - falls wir keinen cooldown eingestellt haben, automatisch 3 sekunden nehmen

        if (timestamps.has(message.author.id)) { //wenn cooldown...
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount; //...nehmen wir die zeit...

            if (now < expirationTime) { //...schauen ob der cooldown noch gilt...
                const timeLeft = (expirationTime - now) / 1000; //...nehmen die wartezeit...
                return message.channel.send(`🚫 **${message.author.username}**, calm down 😓! **${timeLeft.toFixed(2)}** second(s) left.`).then(m => { //...und sagen es unserem ungeduldigen freund
                    m.delete(3500); //und löschen es nach 3.5 sekunden
                })
            }
        }

        timestamps.set(message.author.id, now); //setzen cooldown für den user, falls er keinen cooldown hat
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount); //timeout funktion, nehmen nach der zeit anschließend cooldown weg

        /**
         * jetzt können endlich unsere commands genutzt werden
         */
        try {
            command.execute(bot, message, args); //commands können nun genutzt werden
        } catch (error) {
            console.error(error); //falls was schiefläuft, loggen wir es...
            message.reply('an error occured! Please contact our staff!'); //...und sagen dem user bescheid
        }
    })
})

bot.on('error', err => { //wenn der bot einen error hat
    console.log(err); //fangen wir ihn und loggen ihn
})

bot.login(process.env.TOKEN); //bot login