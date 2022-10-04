module.exports = {
    name: "serveravatar",
    aliases: ["spfp"],
    category: "fun",
    description: 'Show server profile picture of user in big size',
    usage: "[User]",
    run: async ({ client, message, args }) => {
        const { resolveMember } = require('../../functions/parameters');
        let targetMember = await resolveMember(message, args[0], true)

        message.channel.send(targetMember.avatarURL({ size: 256, dynamic: true }))
    }
}