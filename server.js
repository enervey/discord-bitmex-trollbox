const Discord = require('discord.js')
const discordClient = new Discord.Client()
const BitMEXClient = require('bitmex-realtime-api');
const bitmexClient = new BitMEXClient({testnet: false});

bitmexClient.addStream('chat', 'chat', function(data) {
  if (!data.length) return;
  const newMessage = data[data.length - 1];
  
  // Only include messages in the English channel
  if (newMessage.channelID !== 1) return;
  
  // Optionally only include messages by a specific Bitmex user
  if (process.env.BITMEX_USER) {
    if (newMessage.user !== process.env.BITMEX_USER) return;
  }
  
  // Send Discord message
  discordClient.channels.get(process.env.DISCORD_CHANNEL_ID).send(`\`${newMessage.user}\` ${newMessage.message}`);
  
  // Log output to console
  console.log(`${newMessage.user}\` ${newMessage.message}`);
});

discordClient.login(process.env.DISCORD_BOT_TOKEN)