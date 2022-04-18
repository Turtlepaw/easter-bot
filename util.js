//Modules required and handy
const Discord = require('discord.js');
const { Color } = require("./config");

//Pre-loaded Utils.
module.exports.categoryEmojis = {
    //You can edit these to your own. But these should work with interactions/webhooks.
    "Bot": "<:bot_add:863464329738715156>",
    "Discord.js": "<:djs:895374013629599806>",
    "Emojis": "<:reaction_add:863474840726929449>",
    "Fun": "<a:atada:869705649846616104>",
    "Mod": "<:ban:863529097283240016>",
    "Misc": "<:channel_add:863464329755361350>",
    "Slash_Command": "<:slashCommand:872317151451705385>",
    "Rule_Book": "<:rules:890070276094713906>",
    "Pencil": "<:pencil:887514200614780939>",
    "Member_Add": "<:member_invited:887514198651830292>",
    "Error": "<:failed:899071447811624980>",
    "Flag_Remove": "<:flag_remove:863826801162453044>"
}

/**
 * Replys with an error message.
 * @param {String} message The message to say.
 * @param {Discord.Interaction|Discord.Message} interaction The interaction can be a component or a command.
 * @param {"REPLY" | "UPDATE"} replyType If it should reply or edit.
 * @param {Boolean} ephemeral If the interaction reply should be hidden
 */
 module.exports.errorMessage = (message, interaction, replyType="REPLY", ephemeral=true) => {
    const text = message
    if(interaction?.author){
        interaction.channel.send(text)
    } else if(interaction.isMessageComponent()){
        if(replyType === "REPLY"){
            interaction.reply({ content: text, ephemeral: ephemeral });
        } else if(replyType === "UPDATE"){
            interaction.update({ content: text });
        }
    } else if(interaction.isCommand()){
        if(replyType === "REPLY"){
            interaction.reply({ content: text, ephemeral: ephemeral });
        } else if(replyType === "UPDATE"){
            interaction.editReply({ content: text });
        }
    } else if(interaction.isContextMenu()){
        if(replyType === "REPLY"){
            interaction.reply({ content: text, ephemeral: ephemeral });
        } else if(replyType === "UPDATE"){
            interaction.editReply({ content: text });
        }
    }
}


/**
 * Splits buttons into action rows.
 * @param {Discord.MessageButton[]|Discord.MessageButton} buttons 
 * @returns {Discord.MessageActionRow}
 */
module.exports.formatButtons = (buttons) => {
    if(!Array.isArray(buttons)) buttons = [buttons]
    const rows=[new Discord.MessageActionRow()];
    let row = 0;
    let btn = 0;
    for(const button of buttons){
        if(btn === 5){
            rows.push(new MessageActionRow())
            row++
        }
        if(row === 5){
            break
        }
        
        rows[row].addComponents(button)
        btn++
    }
    return rows
}

/**
 * Checks if a member has a permission if they don't the bot will reply/edit to the interaction.
 * @param {Discord.PermissionString} permission 
 * @param {Discord.CommandInteraction} interaction 
 */
module.exports.checkPermissions = async (permission, interaction, customEmbed) => {
    const hasPerms = interaction.member.permissions.has(permission);

    const embed = customEmbed || new Discord.MessageEmbed()
        .setColor(color)
        .setDescription(`${this.categoryEmojis.Flag_Remove} Sorry you don't have enough permissions!`)
    if (!hasPerms) {
        if (interaction.replied || interaction.deferred) {
            await interaction.editReply({ embeds: [embed], ephemeral: true });
        } else {
            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
}

/**
 * Handy for lazy people that don't feel like making an embed.
 * @param {String} text 
 * @returns {Discord.MessageEmbed}
 */
module.exports.createEmbedFromText = (text) => {
    return new Discord.MessageEmbed()
        .setDescription(text)
        .setColor(Color);
}

/**
 * Creates a link button. Handy for lazy people.
 * @param {String} link 
 * @param {Object} options 
 * @param {String} [options.text]
 * @param {String} [options.emoji]
 */
module.exports.createLinkButton = (link, options) => {
    return new Discord.MessageButton()
    .setStyle("LINK")
    .setLabel(options.text)
    .setEmoji(options.emoji)
    .setURL(link);
}

/**
 * Disabled all buttons from the row.
 * @param {Discord.MessageActionRow} row 
 */
module.exports.disableButtons = (row) => {
    for(const button of row.components){
        button.setDisabled(true)
    }
    return row;
}

//You can add your own utils here.