//Ping handler (Works without message intent)
const { Events } = require("discordjsh"); //Imports events
const Discord = require("discord.js");
const { Color } = require("../config");

module.exports = {
    name: Events.messageReactionAdd,
    /**
     * @param {Discord.MessageReaction} reaction
     * @param {Discord.User} user 
     * @param {Discord.Client} client
     */
    async execute(reaction, user, client){
        if(user.bot) return;

        const baseCheck = (await reaction.users.fetch()).has(user.id);
        const old = await client.userKV.get(user.id);
        
        if(old != null && old?.catches.includes(reaction.message.id)){
            return user.send({
                content: "`❌` You've already collected points from this!"
            });
        }

        if(reaction.emoji.name == "🥚" && baseCheck){
            let oldOne = null;
            if(client.userKV.has(user.id)) {
                oldOne = await client.userKV.get(user.id);
                client.userKV.delete(user.id);
            }
    
            await client.userKV.set(user.id, {
                points: oldOne != null ? (oldOne?.points + 1) : 1,
                userId: user.id,
                lastOrigin: reaction,
                catches: (old?.catches != null && isNaN(old.catches)) ? (new Array(...old.catches).push(reaction.message.id)): [reaction.message.id]
            });
    
            await user.send({
                content: `\`🥚\` Caught one!`
            });
        } else if(reaction.emoji.name == "🐣" && baseCheck){
            await user.send({
                content: `\`🔎\` You got tricked!`
            });
        }
    }
}