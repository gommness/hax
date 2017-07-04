/*CLOCKWORKRT.collisions.register([
    {
        shape1: "player",
        shape2: "enemyFire",
        detector: function (player, enemyFire) {
            if (enemyFire.x >= player.x && enemyFire.y >= player.y && enemyFire.x <= player.x + player.w && enemyFire.y <= player.y + player.h) {
                return true;
            } else {
                return false;
            }
        }
    },
    {
        shape1: "enemy",
        shape2: "playerFire",
        detector: function (enemy, playerFire) {
            if (playerFire.x >= enemy.x && playerFire.y >= enemy.y && playerFire.x <= enemy.x + enemy.w && playerFire.y <= enemy.y + enemy.h) {
                return true;
            } else {
                return false;
            }
        }
    }
]);*/

CLOCKWORKRT.collisions.register([
    {
        shape1: "player",
        shape2: "block",
        detector: function (player, block) {
            if ( 
                ((player.x >= block.x && player.x <= block.x + block.w) || (player.x + player.w >= block.x && player.x + player.w <= block.x + block.w)) &&
                ((player.y >= block.y && player.y <= block.y + block.h) || (player.y + player.h >= block.y && player.y + player.h <= block.y + block.h))
            ) {
                return true;
            } else {
                return false;
            }
        }
    },
	



]);