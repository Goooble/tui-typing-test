import game from "./game.js";
import { log } from "./main.js";

//stream handling
const wstream = process.stdout;
const rstream = process.stdin;
rstream.setRawMode(true);
rstream.resume();

//state
const cols = process.stdout.columns;
const rows = process.stdout.rows; //wonder what happens when rows exceed the screen
const cursor = { x: 0, y: 2 };

function horCenter(length) {
  let coordinate = Math.floor(cols / 2 - length / 2);
  return coordinate;
}

function header() {
  wstream.cursorTo(horCenter(process.title.length), 0);
  wstream.write("\x1b[1;4;36m" + process.title + "\x1b[0m");
}
function startScreen() {
  let string = "Press Enter to start the test:";
  wstream.cursorTo(horCenter(string.length), 1);
  wstream.write("\x1b[5mPress Enter to start the test: \x1b[0m");
}
function menu() {}

// function render() {
//   wstream.write("\x1b[?25l");
//   console.clear();
//   console.log(process.title);
//   console.log(
//     "time: " +
//       game.getTime().curTime +
//       "  speed: " +
//       game.getStats().wpm +
//       "wpm   accuracy: " +
//       game.getStats().accuracy +
//       "%    errors: " +
//       game.getStats().errors,
//   );
//   console.log("Sample text:");
//   console.log(game.getTextState().testText);
//   //   console.log(userDisplay);
//   cursor.x = 0;
//   cursor.y = 3;
//   for (let i = 0; i < game.getTextState().userDisplayText.length; i++) {
//     wstream.cursorTo(cursor.x, cursor.y);
//     wstream.write(game.getTextState().userDisplayText[i]);
//     cursor.x++;
//     if (cursor.x == cols) {
//       cursor.x = 0;
//       cursor.y++;
//     }
//   }
//   //   wstream.cursorTo(0, 9);
//   //   console.log(user);
//   wstream.cursorTo(cursor.x, cursor.y);
//   wstream.write("\x1b[?25h");
// }
function render() {
  wstream.write("\x1b[?25l");
  console.clear();

  header();
  if (game.getGameState().isMenu) {
    startScreen();
  }

  wstream.write("\x1b[?25h");
}

export { rstream, wstream, render };
