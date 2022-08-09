const ParticipationRole = require('../../_database/models/participationRoleSchema')

module.exports = {
    name: "removeparticipationrole",
    aliases: ["rpr"],
    category: "participationrole",
    permissions: 10,
    description: 'Removes a Channel Participation role',
    usage: "[Channel ID] <Role ID>",
    run: async ({ client, message, args }) => {
        let roleID = args[1]
        let channelID = args[0]
        if (!roleID) {
            roleID = channelID
            channelID = message.channel.id
        }

        if (!roleID)
            return await message.reply("Role ID not supplied")

        const role = await message.guild.roles.fetch(roleID)

        let pr = await ParticipationRole.findOne({
            guildID: message.guild.id,
            channelID: channelID,
            roleID: roleID
        })

        if (!pr) {
            return await message.reply("No Channel Participation Roles set with the parameters.")
        }

        try {
            await pr.delete()
            await message.reply(`\`${roleID}\` removed from Participation Roles for channel \`${channelID}\`.`)
        } catch (error) {
            addLog(error, error.stack)
        }        
    }
}