const jsh = require("discordjsh");
const { ContextMenuBuilder } = require("discord.js-util");
const { Color } = require("../config");
const { ContextMenuInteraction, Client, MessageEmbed } = require("discord.js");
const { createLinkButton, errorMessage } = require("../util");
const { kv } = require("..");

module.exports = {
    data: new ContextMenuBuilder()
    .setName("🥚 Info")
    .setType("MESSAGE"),
    /**
     * @param {ContextMenuInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client){
        const find = await client.kv.get(interaction.options.getMessage("message").id);
        const message = interaction.options.getMessage("message");

        if(!find) return errorMessage("`❌` This is not a easter egg!", interaction);

        await interaction.reply({
            embeds: [
                new MessageEmbed()
                .setTitle(`🥚 Easter Egg`)
                .setColor(Color)
                .addField("`👆` Reactions", `${message.reactions.cache.size} 🥚`)
                .addField("`➕` Added By", `<@${find.userId}>`)
            ],
            components: [
                {
                    type: 1,
                    components: [
                        createLinkButton(message.url, { text: "Jump to message.", emoji: "🔗" })
                    ]
                }
            ],
            ephemeral: true
        });
    }
}