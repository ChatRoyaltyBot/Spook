module.exports = {
    name: "profilepicture",
    aliases: ["pfp"],
    category: "fun",
    description: 'Show profile picture of user in big size',
    usage: "[User]",
    run: async ({ client, message, args }) => {


        const { resolveMember } = require('../../functions/parameters');
        let targetMember = await resolveMember(message, args[0], true)

        message.channel.send(targetMember.user.displayAvatarURL({ size: 256, dynamic: true}))
    }
}