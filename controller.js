import { rstream } from "./renderer.js";
import game from "./game.js";
import { render } from "./renderer.js";
import fs from "node:fs";
import { EOF } from "node:dns";
import { log } from "./main.js";

//events
rstream.on("data", (chunk) => {
  handleInput(chunk);
  render();
});
setInterval(() => {
  if (game.tick()) {
    render();
    // log("rendering");
  }
}, 20);

function handleInput(chunk) {
  let char = 2000; //for other characters that use ESC
  if (chunk.length == 1) {
    char = chunk[0];
  }
  if (char >= 32 && char <= 126) {
    // console.log(char);
    game.type(char);
  } else if (char == 0x7f) {
    game.backspace();
  } else if (char == 0x1b) {
    process.exit(); //todo
  }
}

export default 2;
