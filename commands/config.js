const jsh = require("discordjsh");
const { Color } = require("../config");
const { ContextMenuInteraction, Client, MessageEmbed, CommandInteraction, MessageButton } = require("discord.js");
const { kv } = require("..");
const { errorMessage } = require("../util");
const { ContextMenuBuilder } = require("discord.js-util");
const { v4 } = require("uuid");

module.exports = {
    data: new jsh.commandBuilder()
    .setName("config")
    .setDescription("Easter Egg!")
    .addSubcommand(s => {
        return s.setName("set")
        .setDescription("Set your server's config.")
        .addRoleOption(e => e.setName("role").setDescription("The role to give to the winner."))
        .addIntegerOption(e => e.setName("win_eggs").setDescription("The amount of easter eggs needed to win."))
        .addChannelOption(e => e.setName("win_channel").setDescription("The channel to announce the win in."))
    })
    .addSubcommand(s => {
        return s.setName("reset")
        .setDescription("Reset ALL your settings including: users, egg messages, and server config.");
    }),
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client){
        if(!interaction.memberPermissions.has("ADMINISTRATOR")) return errorMessage("`❌` Invalid permissions", interaction);
        if(interaction.options.getSubcommand() == "reset"){
            client.configKV.delete("")
            await interaction.reply({
                content: "`✅` Reset everything",
                ephemeral: true
            });
            return;
        }
        let oldConf;
        if(client.configKV.has(interaction.guild.id)){
            oldConf = client.configKV.get(interaction.guild.id);
            client.configKV.delete(interaction.guild.id);
        }

        client.configKV.set(interaction.guild.id, {
            role: interaction.options.getRole("role") || oldConf?.role || null,
            win_eggs: interaction.options.getInteger("win_eggs") || oldConf?.win_eggs || null,
            win_channel: interaction.options.getChannel("win_channel") || oldConf?.win_channel || null
        });

        await interaction.reply({
            content: `\`✅\` Settings updated`,
            ephemeral: true
        })
    }
}
