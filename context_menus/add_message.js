const jsh = require("discordjsh");
const { Color } = require("../config");
const { ContextMenuInteraction, Client, MessageEmbed, CommandInteraction, MessageButton } = require("discord.js");
const { kv } = require("..");
const { errorMessage } = require("../util");
const { ContextMenuBuilder } = require("discord.js-util");
const { v4 } = require("uuid");

module.exports = {
    data: new ContextMenuBuilder()
    .setName("🥚 Add Message")
    .setType("MESSAGE"),
    /**
     * @param {ContextMenuInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client){
        if(!interaction.member.permissions.has("ADMINISTRATOR")) return errorMessage("`❌` Invalid permissions", interaction);
        const message = interaction.options.getMessage("message");

        await client.kv.set(message.id, {
            messageId: message,
            userId: interaction.user.id,
            guildId: interaction.guild.id,
            message: message
        });
        
        const ids = {
            yes: "YES" + v4(),
            no: "NO" + v4(),
            random: "RANDOM" + v4()
        };

        await interaction.reply({
            content: "Should this be a trick?",
            components: [
                {
                    type: 1,
                    components: [
                        new MessageButton()
                        .setLabel("Yes")
                        .setCustomId(ids.yes)
                        .setStyle("SUCCESS"),
                        new MessageButton()
                        .setLabel("No")
                        .setCustomId(ids.no)
                        .setStyle("DANGER"),
                        new MessageButton()
                        .setLabel("Random")
                        .setEmoji("🎲")
                        .setStyle("SECONDARY")
                        .setCustomId(ids.random)
                    ]
                }
            ],
            ephemeral: true
        });

        const int = await interaction.channel.awaitMessageComponent({
            filter: e=>e.user.id==interaction.user.id,
            componentType: "BUTTON"
        });

        let reaction;

        if(int.customId == ids.yes){
            reaction = "🐣"
        } else if(int.customId == ids.no){
            reaction = "🥚"
        } else if(int.customId == ids.random){
            const randoms = [
                "🥚",
                "🥚",
                "🥚",
                "🐣"
            ];
            reaction = randoms[Math.round(Math.random() * (randoms.length-1))];
        }

        await message.react(reaction);

        await int.update({
            content: "\`✅\` Added",
            components: []
        });
    }
}
