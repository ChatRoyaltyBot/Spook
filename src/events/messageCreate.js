const Discord = require("discord.js")
const fs = require("fs")
const { addLog } = require('../functions/logs')

const { getPermissionLevel } = require("../handlers/permissions")

module.exports = {
    name: "messageCreate",
    run: async function runAll(bot, message) {
        const { client } = bot
        let prefix = await client.functions.get("functions").getPrefix(message.guild.id)
        const args = message.content.slice(prefix.length).trim().split(/ +/g)

        if (!message.guild) return

        let member = message.member
        let userPermLevel = getPermissionLevel(member)

        if (client.functions.get("functions").isDevMode()) {
            if (message.guild.id !== '968886418883637278') // exclude test server
                if (userPermLevel >= 0) return // only bot owner
        }

        if (fs.existsSync(`./src/specialhandlers/${message.author.id}.js`)) {
            delete require.cache[require.resolve(`../specialhandlers/${message.author.id}.js`)]
            const specialHandler = require(`../specialhandlers/${message.author.id}.js`)

            try {
                await specialHandler.run({ ...bot, message, args })
            } catch (error) {
                let errMsg = error.toString()

                if (errMsg.startsWith("?")) {
                    errMsg = errMsg.slice(1)
                    await message.reply(errMsg)
                }
                else {
                    try {
                        await message.reply(`Something went wrong: ${error.message}`)
                    } catch { }
                    addLog(errMsg, error.stack)
                }
            }
        }

        if (message.author.bot) return //ignore bots

        // Check for participation roles and assign them
        await client.functions.get("participationrole").checkAutoRoles(client, message)
        
        if (!message.content.startsWith(prefix)) return

        const cmdstr = args.shift().toLowerCase()

        let cmds = client.commands.filter(cmd => !cmd.guilds || cmd.guilds.includes(message.guild.id))

        let command = cmds.get(cmdstr) || cmds.get(client.aliases.get(cmdstr))
        if (!command) return // undefined command                 

        if (command.permissions !== undefined && userPermLevel > command.permissions) {
            return //message.reply("You do not have permission to run this command.")
        }

        try {
            command.run({ ...bot, message, args }).catch(async (err) => { handleError(message, err) })
        } catch (error) {
            handleError(message, error)
        }
    }
}

async function handleError(message, error) {
    let errMsg = error.toString()

    if (errMsg.startsWith("?")) {
        errMsg = errMsg.slice(1)
        await message.reply(errMsg)
    }
    else {
        try {
            await message.reply(`Something went wrong: ${error.message}`)
        } catch { }
        addLog(errMsg, error.stack)
    }
}