import { rstream } from "./renderer.js";
import game from "./game.js";
import { render } from "./renderer.js";
import fs from "node:fs";
import { log } from "./main.js";

//events
rstream.on("data", (chunk) => {
  handleInput(chunk);
  render();
});
setInterval(() => {
  if (game.tick()) {
    render();
  }
}, 20);

function handleInput(chunk) {
  let char = 2000; //for other characters that use ESC
  if (chunk.length == 1) {
    char = chunk[0];
  }
  if (char >= 32 && char <= 126) {
    if (!game.getGameState().isGameOver) {
      game.type(char);
      game.checkGameOver();
    }
  } else if (char == 0x7f) {
    if (!game.getGameState().isGameOver) game.backspace();
  } else if (char == 0x1b) {
    if (game.getGameState().isGameOver) {
      console.clear();
      process.exit();
    }
    game.stopGame();
  } else if (char == 13) {
    if (game.getGameState().isGameOver) game.startGame(false);
  } else if (char == 9) {
    game.startGame(true);
  }
}

export default 2;
