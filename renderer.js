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
  render();
});
//state
let cols = process.stdout.columns;
let rows = process.stdout.rows; //wonder what happens when rows exceed the screen
const cursor = { x: 0, y: 2 };
let frame = "";
//function to find the center starting coordinate
function horCenter(length) {
  let coordinate = Math.floor(cols / 2 - length / 2);
  if (coordinate < 0) return 0;
  return coordinate;
}

//generates ansi escape sequences for cursor
function ansiCursor(x, y) {
  return `\x1b[${y + 1};${x + 1}H`;
}

//UI
function headerScreen(x, y) {
  x = horCenter(process.title.length);
  // wstream.cursorTo(x, y);
  frame += `${ansiCursor(x, y)}\x1b[1;4;36m${process.title}\x1b[0m`;
  // log(y);
  // wstream.write("\x1b[1;4;36m" + process.title + "\x1b[0m");
}
function startScreen(x, y) {
  let string = "Press Enter to start the test:";
  x = horCenter(string.length);
  // wstream.cursorTo(x, y);
  frame += `${ansiCursor(x, y)}\x1b[5m${string}\x1b[0m`;
  log(x + " " + y);
  // log(y);
  // wstream.write("\x1b[5mPress Enter to start the test: \x1b[0m");
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
  x = horCenter(string.length);
  // wstream.cursorTo(x, y);
  frame += `${ansiCursor(x, y)}\x1b[93m${string}\x1b[0m`;

  // wstream.write("\x1b[93m" + string + "\x1b[0m");
}

function gameScreen(x, y) {
  cursor.x = x;
  cursor.y = y;
  //so that can user entry follows it
  const cursorLocations = [];
  let text = game.getTextState().testText;
  let textArray = game.getTextState().testText.split(" ");
  //to determine when to wrap
  let lineWidth = 0,
    wordWidth = 0;

  for (let i = 0; i < textArray.length; i++) {
    wordWidth = textArray[i].length;
    if (lineWidth + wordWidth + 1 > cols) {
      //if the word is gonna cross the edge
      cursor.x = 0;
      cursor.y++;
      lineWidth = 0;
    }
    //render each character
    for (let j = 0; j < textArray[i].length; j++) {
      cursorLocations.push([cursor.x, cursor.y]);
      frame += ansiCursor(cursor.x, cursor.y) + textArray[i][j];
      // wstream.cursorTo(cursor.x, cursor.y);
      // wstream.write(textArray[i][j]);
      cursor.x++;
      lineWidth++;
    }
    //render space
    cursorLocations.push([cursor.x, cursor.y]);
    frame += ansiCursor(cursor.x, cursor.y) + " ";
    // wstream.cursorTo(cursor.x, cursor.y);
    // wstream.write(" ");
    lineWidth++;
    cursor.x++;
  }

  //wrapping user entered text
  cursor.x = 0;
  cursor.y = y;
  let i = 0;
  for (i = 0; i < game.getTextState().userDisplayText.length; i++) {
    cursor.x = cursorLocations[i][0];
    cursor.y = cursorLocations[i][1];
    frame +=
      ansiCursor(cursor.x, cursor.y) + game.getTextState().userDisplayText[i];
    // wstream.cursorTo(cursor.x, cursor.y);
    // wstream.write(game.getTextState().userDisplayText[i]);
  }
  //to move cursor to the next line after the render
  if (cursorLocations[i][1] > cursor.y) {
    cursor.x = 0;
    cursor.y++;
  }
  //to fix the tinial caret to the first character
  let cursorx = cursor.x;
  if (cursor.x != 0) {
    cursorx++;
  }
  wstream.cursorTo(cursorx, cursor.y);
  lines = cursor.y;
}
let lines; //to dsiplay startscreen after all the testtext

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
    startScreen(0, lines + 2);
  }
  wstream.write(frame);
  // log(frame);
  frame = "";

  wstream.write("\x1b[?25h");
}

export { rstream, wstream, render };
