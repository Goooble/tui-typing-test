import { create } from "node:domain";
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
  buffer = createBuffer(rows, cols);
  renderedBuffer = createBuffer(rows, cols);
  //fill buffer
  render();
});

//state
let cols = process.stdout.columns;
let rows = process.stdout.rows; //wonder what happens when rows exceed the screen
const cursor = { x: 0, y: 2 };
function createBuffer(rows, cols) {
  return Array.from(new Array(rows), (x) => {
    return new Array(cols).fill(" ");
  });
}
let buffer = createBuffer(rows, cols);
let renderedBuffer = createBuffer(rows, cols);
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
  let string = process.title;
  let i;
  for (i = 0; i < string.length; i++) {
    buffer[y][x + i] = `\x1b[1;4;36m${string[i]}\x1b[0m`;
  }
  cursor.x = x + i;
  cursor.y = y;
}
function startScreen(x, y) {
  let string = "Press Enter to start the test:";
  x = horCenter(string.length);
  let i;
  for (i = 0; i < string.length; i++) {
    buffer[y][x + i] = `\x1b[5m${string[i]}\x1b[0m`;
  }
  cursor.x = x + i + 1;
  cursor.y = y;
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
  for (let i = 0; i < string.length; i++) {
    buffer[y][x + i] = `\x1b[93m${string[i]}\x1b[0m`;
  }
}

//I am moving around teh global cursor state here
//which i should not be doing
//its just legacy from when I wasnt using frames or buffers
//I am too lazy to fix this so its just gonna be here since it works for now
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
      buffer[cursor.y][cursor.x] = textArray[i][j];
      cursor.x++;
      lineWidth++;
    }
    //render space
    cursorLocations.push([cursor.x, cursor.y]);
    buffer[cursor.y][cursor.x] = " ";
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
    buffer[cursor.y][cursor.x] = game.getTextState().userDisplayText[i];
  }
  cursor.x = cursorLocations[i][0];
  cursor.y = cursorLocations[i][1];
  lines = cursor.y;
}
let lines; //to dsiplay startscreen after all the testtext

function fillBuffer() {
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
}

function bufferDiff() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (renderedBuffer[i][j] != buffer[i][j]) {
        renderedBuffer[i][j] = buffer[i][j];
      }
    }
  }
}

function generateFrame() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      frame += ansiCursor(j, i) + renderedBuffer[i][j];
    }
  }
  buffer = createBuffer(rows, cols);
}

function render() {
  // wstream.write("\x1b[?25l");
  fillBuffer();
  bufferDiff();
  generateFrame();
  wstream.write(frame);
  wstream.cursorTo(cursor.x, cursor.y);
  frame = "";
  // wstream.write("\x1b[?25h");
}

export { rstream, wstream, render };
