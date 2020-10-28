module.exports = {
    name: 'invite',
    aliases: ['add', 'addbot', 'inviteme'],
    description: 'Invite me to your server.',
    cooldown: 5,
    async execute(bot, message) {

        message.channel.send('✅ **Invite me to your server using this link:**\n' +
            '<https://discord.com/oauth2/authorize?client_id=585142238217240577&scope=bot&permissions=19520>').catch(() => {});

    }
};