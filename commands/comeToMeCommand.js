module.exports = function(bot, goals) {
    bot.on('chat', (username, message) => {
        if (username === bot.username) return;
      
        if (message === '!cometome') {
          const playerEntity = bot.players[username]?.entity;
          if (playerEntity) {
            bot.pathfinder.setGoal(new goals.GoalNear(playerEntity.position.x, playerEntity.position.y, playerEntity.position.z, 1));
            bot.chat('On my way, ' + username + '!');
          } else {
            bot.chat("I can't see you, " + username + "!");
          }
        }
      });
}