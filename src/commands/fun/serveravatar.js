module.exports = {
    name: "serveravatar",
    aliases: ["spfp"],
    category: "fun",
    description: 'Show server profile picture of user in big size',
    usage: "[User]",
    run: async ({ client, message, args }) => {
        const { resolveMember } = require('../../functions/parameters');
        let targetMember = await resolveMember(message, args[0], true)

        let serveravatar = targetMember.avatarURL({ size: 256, dynamic: true })
        if (!!serveravatar)
            return await message.channel.send(serveravatar)

        return await message.channel.send(targetMember.user.displayAvatarURL({ size: 256, dynamic: true }))
    }
}