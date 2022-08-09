const mongoose = require('mongoose')
const ParticipationRole = require('../../_database/models/participationRoleSchema')

module.exports = {
    name: "addparticipationrole",
    aliases: ["apr"],
    category: "participationrole",
    permissions: 10,
    description: 'Add a Channel Participation role',
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
        const channel = await message.guild.channels.fetch(channelID)

        if (!role)
            return await message.reply("Role not found")

        let pr = await ParticipationRole.findOne({
            guildID: message.guild.id,
            channelID: channelID,
            roleID: roleID
        })

        if (pr) {
            return await message.reply(`Role \`${role.name}\` already added for \`${channel.name}\``)
        }

        pr = await new ParticipationRole({
            _id: mongoose.Types.ObjectId(),
            guildID: message.guild.id,
            channelID: channelID,
            roleID: roleID
        })

        try {
            await pr.save()
            await message.reply(`\`${role.name}\` added as Participation Role for \`${channel.name}\`.`)
        } catch (error) {
            addLog(error, error.stack)
        }        
    }
}