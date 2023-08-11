module.exports = function(bot) {
    bot.on('chat', (username, message) => {
      if (username === bot.username) return;
      if (message === "!help" || message === "!commands") {
        bot.chat("!cometome : Makes bot come to u thats it");
      }
    });
  }
  
  