import game from "./game.js";
import { render } from "./renderer.js";
import fs from "node:fs";
import controller from "./controller.js"; //random export to run the file

console.clear();
const logPath = "./log.txt";
process.title = "Typing Test";
fs.writeFile(logPath, "", (e) => {
  if (e) throw Error(e);
});

function log(content) {
  fs.writeFile(
    logPath,
    new Date().toLocaleTimeString() + ": " + content + "\n",
    { flag: "a" },
    (e) => {
      if (e) throw Error(e);
    },
  );
}

export { log };
