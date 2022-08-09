const ParticipationRole = require('../_database/models/participationRoleSchema')

async function checkAutoRoles(client, message) {
    let pr = await ParticipationRole.findOne({
        guildID: message.guild.id,
        channelID: message.channel.id
    })
    const member = message.member

    if (!!pr) {
        if (!member.roles.cache.has(role.roleID)) {
            member.roles.add(role.roleID)
            const role = message.guild.roles.cache.get(r.roleID)
            const roleName = role.name || entry.roleID
            let msg = `Congratulations <@${member.id}> :tada:, you have received the following role: ${roleName}`
            await message.channel.send(msg)
        }
    }
}

module.exports = {
    name: "participationrole",
    checkAutoRoles,
}