const { Movements, goals } = require('mineflayer-pathfinder');

const toolTypes = {
  diamond_ore: 'diamond_pickaxe',
  // Add other block types and corresponding tool types here
};

let currentTool = null;  // Define currentTool here

async function getBestToolForBlock(bot, blockType) {
  const bestToolType = toolTypes[blockType];
  if (!bestToolType) return null;

  if (currentTool?.name === bestToolType) return currentTool;

  const bestTool = bot.inventory.items().find(item => item.name === bestToolType);
  if (!bestTool) return null;

  currentTool = bestTool;
  await equipBestTool(bot, blockType);

  return bestTool;
}

async function equipBestTool(bot, blockType) {
  const tool = bot.pathfinder.bestHarvestTool({ name: blockType });
  if (tool) {
    try {
      await bot.equip(tool, 'hand');
    } catch (error) {
      console.error('Failed to equip tool:', tool, '\n', error);
    }
  }
}

function restartPathfinding(bot) {
  bot.pathfinder.setGoal(null);
  setTimeout(() => {
    const currentGoal = bot.pathfinder.goal;
    if (currentGoal) {
      bot.pathfinder.setGoal(currentGoal);
    }
  }, 10000); // Adjust the delay as needed
}

function startMiningTunnel(bot, targetY, tunnelDistance) {
  console.log("Starting mining tunnel...");

  const bestTool = getBestToolForBlock(bot, 'diamond_ore');
  if (!bestTool) {
    console.log("No suitable tool found.");
    return;
  }

  const movement = new Movements(bot, bestTool.equipType);
  bot.pathfinder.setMovements(movement);

  const goal = new goals.GoalBlock(tunnelDistance, targetY, 0.5);
  console.log("Setting goal:", goal);
  bot.pathfinder.setGoal(goal);

  bot.on('path_update', (results) => {
    if (!results.path.length) {
      console.log("No path found.");
      restartPathfinding(bot);
    }
  });

  bot.on('stuck', () => {
    console.log("Bot is stuck. Restarting pathfinding...");
    restartPathfinding(bot);
  });
}


module.exports = function(bot) {
  bot.on('chat', (username, message) => {
    if (username === bot.username) return;

    const commandRegex = /^!minetime\s+(-?\d+)\s+(-?\d+)/;
    const match = message.match(commandRegex);
    
    if (match) {
      const targetY = parseFloat(match[1]);
      const tunnelDistance = parseFloat(match[2]);
      
      if (!isNaN(targetY) && !isNaN(tunnelDistance)) {
        startMiningTunnel(bot, targetY, tunnelDistance);
        bot.chat(`Heading to Y ${targetY} and starting a ${tunnelDistance} block tunnel.`);
        return;
      }
    } else if (message.startsWith('!minetime')) {
      bot.chat("Usage: !minetime [y value] [Tunnel Distance]");
    }
  });
};