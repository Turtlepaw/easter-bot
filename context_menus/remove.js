const jsh = require("discordjsh");
const { Color } = require("../config");
const { ContextMenuInteraction, Client, MessageEmbed, CommandInteraction, ReactionManager, MessageReaction } = require("discord.js");
const { kv } = require("..");
const { errorMessage } = require("../util");
const { ContextMenuBuilder } = require("discord.js-util");

module.exports = {
    data: new ContextMenuBuilder()
    .setName("🥚 Remove Message")
    .setType("MESSAGE"),
    /**
     * @param {ContextMenuInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client){
        if(!interaction.memberPermissions.has("ADMINISTRATOR")) return errorMessage("`❌` Invalid permissions", interaction);
        const message = interaction.options.getMessage("message");
        /**@type {ReactionManager} */
        const reactions = message.reactions;
        await client.kv.delete(message.id);
        reactions.cache.filter(e => (e.emoji == "🥚") || (e.emoji == "🐣")).forEach(e => e.remove());

        await interaction.reply({
            content: "\`✅\` Deleted",
            ephemeral: true
        });
    }
}