const { joinVoiceChannel, createAudioPlayer, createAudioResource, NoSubscriberBehavior, AudioPlayerStatus } = require('@discordjs/voice')
const { getGuildSettings } = require("../../functions/functions")
const fs = require("fs")
const path = require("path");
module.exports = {
    name: "play",
    category: "audio",
    description: 'play sound',
    usage: '[index]',
    run: async ({ client, message, args }) => {

        const settings = await getGuildSettings(message.guild.id)
        if (!settings.voiceChannelID) {
            message.reply("No Voice Channel set up. Use settings to initialize it.")
            return
        }

        let player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Pause,
            },
        });
        client.audioPlayers.set(message.guild.id, player)

        const connection = joinVoiceChannel({
            channelId: settings.voiceChannelID,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator,
        });

        let files = fs.readdirSync('./audio/');
        let index = args[0]
        if (isNaN(index)) {
            index = Math.floor(Math.random() * files.length)
        }
        const file = path.resolve('./audio/', files[index]);

        const resource = createAudioResource(file, { inlineVolume: true });
        player.play(resource);
        connection.subscribe(player);

        player.on(AudioPlayerStatus.Idle, () => {
            player.stop();
            connection.destroy();
            client.audioPlayers.set(message.guild.id, null)
        })
    }
}