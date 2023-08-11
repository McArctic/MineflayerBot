const { pathfinder, Movements, goals} = require('mineflayer-pathfinder');
const mineflayer = require('mineflayer');

//NOT WORKING
// GETS STUCK RANDOMLY
// 0 FUCKING CLUE WHY
// THINKING OF FIX OF LIKE IF THE SAME CORDS ARE REPEATED WITH NO CHANGE THEN TRY AND BREAK BLOCKS AROUND IT TILL IT CAN MOVE AGAIN AHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH


module.exports = function(bot) {

  bot.on('chat', (username, message) => {
    if (username === bot.username) return;

    const commandRegex = /^!minetime\s+(-?\d+)\s+(-?\d+)/;
    const match = message.match(commandRegex);
    
    if (match) {
      const targetY = parseFloat(match[1]);
      const tunnelDistance = parseFloat(match[2]);
      
      if (!isNaN(targetY) && !isNaN(tunnelDistance)) {
        goToYLevel(bot, targetY, tunnelDistance);
        bot.chat(`Heading to Y ${targetY} and starting a ${tunnelDistance} block tunnel.`);
        return;
      }
    } else if (message.startsWith('!minetime')) {
      bot.chat("Usage: !minetime [y value] [Tunnel Distance]");
    }
  });

  async function goToYLevel(bot, targetY, tunnelDistance) {
    bot.chat("Going To")
    bot.pathfinder.setGoal(new goals.GoalY(targetY))

    const positionChecker = setInterval(() => {
      const currentPos = bot.entity.position;
      if (currentPos) {
        console.log(`Current Position: X=${currentPos.x}, Y=${currentPos.y}, Z=${currentPos.z}`);
      }
    }, 20)




    bot.on('goal_reached', (goal) => {
      if (goal instanceof goals.GoalY && goal.y === targetY) {
        clearInterval(positionUpdateInterval);
        bot.chat('Reached Y Level ' + targetY);
      }
    })
  }
  
};
