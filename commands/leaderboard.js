const jsh = require("discordjsh");
const { Color } = require("../config");
const { ContextMenuInteraction, Client, MessageEmbed, CommandInteraction, MessageButton } = require("discord.js");
const { kv } = require("..");
const { errorMessage } = require("../util");
const { ContextMenuBuilder } = require("discord.js-util");
const { v4 } = require("uuid");

module.exports = {
    data: new jsh.commandBuilder()
    .setName("leaderboard")
    .setDescription("Check the server's leaderboard."),
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client){
        await interaction.deferReply();

        const ebd = new MessageEmbed()
        .setTitle("Leaderboard")
        .setColor(Color);

        const allMembers = interaction.guild.members.cache;
        const items = Array.from(allMembers.values()).sort(function(user) {
            return client.kv.get(`${user.id}/${interaction.guild.id}`).points;
        });

        let count = 1;
        for (const member of items){
            const find = await client.userKV.get(`${member.id}/${interaction.guild.id}`);
            if(!find) continue;
            ebd.addField(`#${count}`, `${member} (${find.points} 🥚)`)
            count++
        }

        await interaction.editReply({
            embeds: [
                ebd
            ]
        });
    }
}