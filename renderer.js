import game from "./game.js";
import { log } from "./main.js";

//stream handling
const wstream = process.stdout;
const rstream = process.stdin;
rstream.setRawMode(true);
rstream.resume();
wstream.on("resize", () => {
  cols = wstream.columns;
  rows = wstream.rows;
});
//state
let cols = process.stdout.columns;
let rows = process.stdout.rows; //wonder what happens when rows exceed the screen
const cursor = { x: 0, y: 2 };

function horCenter(length) {
  let coordinate = Math.floor(cols / 2 - length / 2);
  return coordinate;
}

function headerScreen(x, y) {
  wstream.cursorTo(horCenter(process.title.length), y);
  wstream.write("\x1b[1;4;36m" + process.title + "\x1b[0m");
}
function startScreen(x, y) {
  let string = "Press Enter to start the test:";
  wstream.cursorTo(horCenter(string.length), y);
  wstream.write("\x1b[5mPress Enter to start the test: \x1b[0m");
}

function statsScreen(x, y, isGameOver) {
  let time;
  let wpm;
  if (isGameOver) {
    time = game.getTime().endTime;
    wpm = game.getStats().prevWPM;
  } else {
    time = game.getTime().curTime;
    wpm = game.getStats().wpm;
  }
  let string =
    "time: " +
    time +
    " seconds" +
    "  speed: " +
    wpm +
    "wpm   accuracy: " +
    game.getStats().accuracy +
    "%    errors: " +
    game.getStats().errors;
  wstream.cursorTo(horCenter(string.length), y);
  wstream.write("\x1b[93m" + string + "\x1b[0m");
}

function gameScreen(x, y) {
  cursor.x = x;
  cursor.y = y;
  let textArray = game.getTextState().testText.split(" ");
  let spaceWidth = 0,
    lineWidth = 0,
    wordWidth = 0;
  for (let i = 0; i < textArray.length; i++) {
    wordWidth = textArray[i].length;
    if (lineWidth + wordWidth > cols) {
      cursor.x = 0;
      cursor.y++;
      lineWidth = 0;
      spaceWidth = 0;
    }

    for (let j = 0; j < textArray[i].length; j++) {
      wstream.cursorTo(cursor.x, cursor.y);
      wstream.write(textArray[i][j]);
      cursor.x++;
      lineWidth++;
    }
    wstream.cursorTo(cursor.x, cursor.y);
    wstream.write(" ");
    lineWidth++;
    cursor.x++;
  }

  //   wstream.write(game.getTextState().testText);
  cursor.x = 0;
  cursor.y = y;
  for (let i = 0; i < game.getTextState().userDisplayText.length; i++) {
    wstream.cursorTo(cursor.x, cursor.y);
    wstream.write(game.getTextState().userDisplayText[i]);
    cursor.x++;
    if (cursor.x == cols) {
      cursor.x = 0;
      cursor.y++;
    }
  }
  wstream.cursorTo(cursor.x, cursor.y);
}

function render() {
  wstream.write("\x1b[?25l");
  console.clear();

  headerScreen(0, 0);
  if (game.getGameState().isMenu) {
    startScreen(0, 1);
  } else if (game.getGameState().isGameOver === false) {
    statsScreen(0, 2, false);
    gameScreen(0, 4);
  } else {
    statsScreen(0, 2, true);
    gameScreen(0, 4);
    startScreen(0, 6);
  }

  wstream.write("\x1b[?25h");
}

export { rstream, wstream, render };
