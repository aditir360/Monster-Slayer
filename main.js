/*
@title: Monster Slayer
@author: Aditi Ranjan
*/

const player = "p";
const monster = "m";
const attack = "a";
const heart = "h";

let playerHealth = 3;
let monstersDefeated = 0;

setLegend(
  [player, bitmap`
................
................
......HHHHH.....
......HHHHH...CC
.....HHHHHHH..CC
......0...0.0CC.
....0003.30.0C..
....0.0...000...
...00.05550.....
.....00...0.....
.....0....0.....
.....02..00.....
.....00000......
......0.0.......
.....DD.DD......
................`],
  [monster, bitmap`
................
......CCCC......
.....CCCCCC.....
....CC0CC0CC....
....C000000C....
....CC0000CC....
....CCCCCCCC....
....CCCCCCCC....
....C0C..C0C....
.....C....C.....
................
................
................
................
................
................`],
  [attack, bitmap`
................
................
................
......233.......
.....333333.....
....33333333....
.....333333.....
......3333......
................
................
................
................
................
................
................
................`],
  [heart, bitmap`
................
................
...55....55.....
..5555..5555....
.555555555555...
.555555555555...
.555555555555...
..5555555555....
...55555555.....
....555555......
.....5555.......
......55........
................
................
................
................`]
);

setSolids([player, monster]);

let level = 0;
const levels = [
  map`
.............
.p.......m...
......h......
...m.........
.............
....m....h...
.............
...m.........
.............
..m.......m..
.............
......m......
.............
.m......m....`
];

setMap(levels[level]);

setPushables({
  [player]: []
});

function attackMonsters(x, y) {
  const tiles = getTile(x, y);
  for (let tile of tiles) {
    if (tile.type === monster) {
      clearTile(x, y);
      monstersDefeated++;
      return;
    }
  }
}

function checkPlayerHealth() {
  if (playerHealth <= 0) {
    addText("Game Over!", { x: 4, y: 4, color: color`3` });
    afterInput = () => {}; // Disable input after game over
  }
}

onInput("w", () => {
  getFirst(player).y -= 1;
});

onInput("a", () => {
  getFirst(player).x -= 1;
});

onInput("s", () => {
  getFirst(player).y += 1;
});

onInput("d", () => {
  getFirst(player).x += 1;
});

onInput("j", () => {
  const playerPos = getFirst(player);
  addSprite(playerPos.x, playerPos.y, attack);
  attackMonsters(playerPos.x, playerPos.y);
});

afterInput(() => {
  const playerPos = getFirst(player);

  const nearbyTiles = [
    getTile(playerPos.x, playerPos.y - 1),
    getTile(playerPos.x, playerPos.y + 1),
    getTile(playerPos.x - 1, playerPos.y),
    getTile(playerPos.x + 1, playerPos.y)
  ];

  for (let tiles of nearbyTiles) {
    for (let tile of tiles) {
      if (tile.type === monster) {
        playerHealth--;
        addText(`Health: ${playerHealth}`, { x: 1, y: 1, color: color`3` });
        checkPlayerHealth();
      }
    }
  }

  if (monstersDefeated >= 10) {
    addText("You Win!", { x: 4, y: 4, color: color`3` });
    afterInput = () => {}; // Disable input after win
  }
});
