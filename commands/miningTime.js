const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const mcData = require('minecraft-data');

const cardinalDirections = [
    { x: 1, y: 0, z: 0 },
    { x: -1, y: 0, z: 0 },
    { x: 0, y: 0, z: 1 },
    { x: 0, y: 0, z: -1 }
];

class NewMovement extends Movements {
    getNeighbors(node) {
        const neighbors = [];

        for (const i in cardinalDirections) {
            const dir = cardinalDirections[i];
            this.getMoveForward(node, dir, neighbors);
            this.getMoveJumpUp(node, dir, neighbors);
            this.getMoveDropDown(node, dir, neighbors);
            if (this.allowParkour) {
                this.getMoveParkourForward(node, dir, neighbors);
            }
        }

        this.getMoveDown(node, neighbors);
        this.getMoveUp(node, neighbors);

        return neighbors;
    }
}

module.exports = function(bot) {
    const mcData = require('minecraft-data')(bot.version);
    const defaultMove = new NewMovement(bot, mcData);
    bot.pathfinder.setMovements(defaultMove);

    bot.on('chat', (username, message) => {
        console.log(message);
        if (username === bot.username) return;

        const commandRegex = /^!minetime\s+(-?\d+)\s+(-?\d+)/;
        const match = message.match(commandRegex);

        if (match) {
            const targetY = parseFloat(match[1]);
            const tunnelDistance = parseFloat(match[2]);

            if (!isNaN(targetY) && !isNaN(tunnelDistance)) {
                goToYLevel(bot, targetY, tunnelDistance);
                bot.chat(`Heading to Y ${targetY} and starting a ${tunnelDistance} block tunnel.`);
            }
        } else if (message.startsWith('!minetime')) {
            bot.chat("Usage: !minetime [y value] [Tunnel Distance]");
        }
    });

    async function goToYLevel(bot, targetY, tunnelDistance) {
        bot.pathfinder.setGoal(new goals.GoalY(targetY));
    }
}
