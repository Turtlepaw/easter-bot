//Import all modules
const Discord = require("discord.js"); //Not really used in this code but handy.
const jsh = require("discordjsh"); //Discord JS (bot) handler
const config = require("./config.json"); //Your config options. You need to edit that.
const botConfig = require("./config"); //Your config options (e.g. Color). You can edit that.
const keyv = require("keyv");
const { KeyvFile } = require('keyv-file')

//Set up client
const ClientBuilder = new jsh.Client({
    token: config.token, //Bot Token. You can get this @ https://discord.com/developers/applications
    clientID: config.clientID, //Bot Client ID. You can get this @ https://discord.com/developers/applications
    testGuildID: config.testGuildID //Your test guild ID. https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-
})
    //This sets all the dirs for the bot.
    .setCommandsDir() //Default is`./commands`
    .setContextDir() //Default is `./context_menus`
    .setEventsDir(); //Default is `./events`
//Creates the Discord.Client and returns it. This is where you can set your ClientOptions.
const client = ClientBuilder.create({
    intents: ["GUILDS", "GUILD_MESSAGE_REACTIONS"], //You can change the intents here or remove them. https://discordjs.guide/popular-topics/intents.html#gateway-intents
    partials: ["CHANNEL", "REACTION", "MESSAGE", "GUILD_MEMBER", "USER"], //You can optionally add partials. https://discordjs.guide/popular-topics/partials.html
    presence: {
        //⚠️ If your bot does not change status wait a few seconds and then start the program.
        status: "online", //You can make your bot idle, dnd, online, or invisible/offline.
        activities: [{
            name: "🥚",
            type: "WATCHING"
        }],
    }
});

//You can define client values here.
client.Color = botConfig.Color;
client.Config = botConfig;
const kv = client.kv = global.kv = new keyv({
    store: new KeyvFile({
        filename: `./data/temp.json`, // the file path to store the data
        writeDelay: 100, // ms, batch write to disk in a specific duration, enhance write performance.
        encode: JSON.stringify, // serialize function
        decode: JSON.parse // deserialize function
    })
});
client.userKV = new keyv({
    store: new KeyvFile({
        filename: `./data/users.json`, // the file path to store the data
        writeDelay: 100, // ms, batch write to disk in a specific duration, enhance write performance.
        encode: JSON.stringify, // serialize function
        decode: JSON.parse // deserialize function
    })
});
client.configKV = new keyv({
    store: new KeyvFile({
        filename: `./data/conf.json`, // the file path to store the data
        writeDelay: 100, // ms, batch write to disk in a specific duration, enhance write performance.
        encode: JSON.stringify, // serialize function
        decode: JSON.parse // deserialize function
    })
});

//This is when the bot is ready. The bot is *fully* ready after 4s after this
client.on("ready", async () => {
    //You can remove this but use the invite to invite your bot to your test guild.
    console.log(`Invite me with: ${client.generateInvite({ scopes: ["applications.commands", "bot"], permissions: "ADMINISTRATOR", guild: config.testGuildID })}`)
});