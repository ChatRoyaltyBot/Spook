const { joinVoiceChannel, createAudioPlayer, createAudioResource, NoSubscriberBehavior, StreamType, AudioPlayerStatus, demuxProbe } = require('@discordjs/voice')
const { getGuildSettings } = require("../../functions/functions")

module.exports = {
    name: "youtube",
    category: "audio",
    description: 'play sound',
    usage: '<url>',
    run: async ({ client, message, args }) => {

        let url = args.join(' ')

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

        // const play = require('discordjs-ytdl')
        // play.play(connection, 'https://www.youtube.com/watch?v=mmr7SSi4aW4', 'AIzaSyDKAiYRZ0GH23WQV1Eow2GsEVrfdkEtpp4')

        let ytdl = require("ytdl-core")
        if (!url)
        url = 'https://www.youtube.com/watch?v=00I6JCz5tvI'
        const audio = ytdl(url, { filter : 'audioonly' });
        const { stream, type } = await demuxProbe(audio);
        const resource = createAudioResource(stream, { inputType: type, inlineVolume: true});
        resource.volume.setVolume(0.5)
        player.play(resource)
        connection.subscribe(player)

        player.on(AudioPlayerStatus.Idle, () => {
            player.stop();
            connection.destroy();
            client.audioPlayers.set(message.guild.id, null)
        })
    }
}