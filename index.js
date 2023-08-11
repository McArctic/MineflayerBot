const mineflayer = require('mineflayer');
const loginDetails = require('./configs/login.json');
const { Client, Events, GatewayIntentBits, messageLink } = require('discord.js');
const { token } = require('./configs/config.json');
const client = new Client({ intents: [3276799] });
const { pathfinder, Movements, goals} = require('mineflayer-pathfinder')
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});
client.login(token);

const bot = mineflayer.createBot(loginDetails);


bot.loadPlugin(pathfinder);


//Command Consts
const helpCommand = require('./commands/helpCommand.js')
const comeToMeCommand = require('./commands/comeToMeCommand.js');
const mineCommand = require('./commands/miningTime.js');
//Call That Shit


bot.once('spawn', () => {
  helpCommand(bot);
  comeToMeCommand(bot, goals);
  mineCommand(bot, goals);
})

bot.on('chat', (username, message) => {if (username === bot.username) return;
  if (message === '!treetime') {

    treeHarvestCommand(bot, username, goals)

  } else return;
  

})


// I aint fucking with this dogshit
bot.on('chat', (username, message) => {if (username === bot.username) return;
  const channel = client.channels.cache.get('1138137506437681242')

  if(message.includes("@everyone") || message.includes("@here") || message.includes("http://") || message.includes("https://")){
    channel.send(`**${username}** : \`${message}\``)
  } else {
  channel.send("**"+username+"**"+" : "+message)
  }
});

bot.on('playerJoined', player => {
  const channel = client.channels.cache.get('1138137506437681242')
  console.log(`${player.username} joined the game`);
  channel.send(`**${player.username} joined the game**`);
});

bot.on('playerLeft', player => {
  const channel = client.channels.cache.get('1138137506437681242')
  console.log(`${player.username} left the game`);
  channel.send(`**${player.username} left the game**`);
});
//fuck discord UwU

//Crazy????
bot.on('chat', (username, message) => {
  if (username === bot.username) return;

  const crazyPattern = /cra+z+y/i;

  if(crazyPattern.test(message)){
    bot.chat("Crazy? I was crazy once...")
  }
});

//Linking discord and Minecraft
const discordChannelId = '1138137506437681242';

client.on('messageCreate', message => {
  if (message.author.bot) return;

  // Check if the message was sent in the target channel
  if (message.channel.id === discordChannelId && message.author.username === 'mcarctic') {
    console.log('Message is in the target channel'); 
    const minecraftMessage = `<${message.author.username}> ${message.content}`;
    bot.chat(minecraftMessage);
    console.log('Sent to Minecraft:', minecraftMessage);
  }
  
});