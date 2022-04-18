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

        const guild = await client.configKV.get(reaction.message.guild.id);
        const baseCheck = (await reaction.users.fetch()).has(user.id);
        const old = await client.userKV.get(`${user.id}/${reaction.message.guild.id}`);
        
        if(guild != null){
            if(guild?.done) return user.send({
                content: "`🏆` Someone already won the game!"
            });
    
            if(guild?.win_eggs != null && guild.win_eggs == (old?.points+1) && reaction.emoji.name == "🥚"){
                user.send({
                    content: `\`🏆\` Congrats! You won by getting all the eggs (\`${guild.win_eggs}\`)`
                });
                if(guild.win_channel != null){
                    const chan = await reaction.message.guild.channels.fetch(guild.win_channel.id);
    
                    chan.send({
                        content: `\`🏆\` Congrats! ${user} has won the game by collecting all the eggs! (\`${guild.win_eggs}\`)`
                    });
                }
                if(guild.role != null){
                    const role = await reaction.message.guild.roles.fetch(guild.role.id);
                    const member = await reaction.message.guild.members.fetch(user);
                    member.roles.add(role);
                }
            }
        }

        if(old != null && old?.catches.includes(reaction.message.id)){
            return user.send({
                content: "`❌` You've already collected points from this!"
            });
        }

        if(reaction.emoji.name == "🥚" && baseCheck){
            let oldOne = null;
            if(client.userKV.has(`${user.id}/${reaction.message.guild.id}`)) {
                oldOne = await client.userKV.get(`${user.id}/${reaction.message.guild.id}`);
                client.userKV.delete(`${user.id}/${reaction.message.guild.id}`);
            }
    
            await client.userKV.set(`${user.id}/${reaction.message.guild.id}`, {
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
