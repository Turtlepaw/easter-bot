const jsh = require("discordjsh");
const { Color } = require("../config");
const { ContextMenuInteraction, Client, MessageEmbed, CommandInteraction, MessageButton } = require("discord.js");
const { kv } = require("..");
const { errorMessage } = require("../util");
const { ContextMenuBuilder } = require("discord.js-util");
const { v4 } = require("uuid");

module.exports = {
    devOnly: true, //This toggles if it should be in your test server
    data: new jsh.commandBuilder()
    .setName("points")
    .setDescription("Check you or someone else's points.")
    .addUserOption(e => e.setName("user").setDescription("The user to view.")),
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client){
        const user = interaction.options.getUser("user") || interaction.user;
        const find = await client.userKV.get(`${user.id}/${interaction.guild.id}`);

        if(!find) return errorMessage("`❌` This user does not have any points!", interaction);

        await interaction.reply({
            content: `${user}'s points: ${find.points || "None"}`,
            ephemeral: true
        });
    }
}