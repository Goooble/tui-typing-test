import { log } from "./main.js";
import words from "./words.js";
function selectText() {
  let text = [];
  for (let i = 0; i < 30; i++) {
    text.push(words[Math.floor(Math.random() * words.length)]);
  }
  return text.join(" ");
}

function master() {
  //text
  let testText = selectText();
  let currText = testText;
  let userText = "";
  let userDisplayText = [];
  let index = 0;
  //time
  let startTime = Math.floor(process.uptime());
  let endTime = -1;
  let curTime = -1;
  let prevTime = -1;
  //stats
  let accuracy = 100;
  let wpm = 0;
  let prevWPM = -1;
  let errors = 0;

  //game state
  let isMenu = true;
  let isGameOver = true;

  //typing
  function type(char) {
    char = String.fromCharCode(char);
    userText += char;
    if (testText[index] == char) {
      userDisplayText.push("\x1b[32m" + testText[index] + "\x1b[0m");
    } else {
      let string =
        testText[index] == " "
          ? "\x1b[41m" + testText[index] + "\x1b[0m"
          : "\x1b[31m" + testText[index] + "\x1b[0m";
      userDisplayText.push(string);
      errors++;
    }
    index++;
  }
  function backspace() {
    if (index > 0) {
      index--;
      if (userText[index] != testText[index]) errors--;
      userDisplayText.pop();
      userText = userText.slice(0, -1);
    }
  }
  function tick() {
    let change = false;
    curTime = Math.floor(process.uptime() - startTime);
    if (prevTime < curTime) {
      change = true;
      prevTime = curTime;
    }
    computeStats();
    return change;
  }
  function computeStats() {
    accuracy = Math.floor(((userText.length - errors) / userText.length) * 100);
    wpm = Math.floor(
      (((userText.length / 5) * 60) / curTime) * (accuracy / 100),
    );
  }

  function getStats() {
    return { accuracy, wpm, errors, prevWPM };
  }
  function getTime() {
    return {
      startTime,
      endTime,
      curTime,
      prevTime,
    };
  }
  function getTextState() {
    return { testText, userText, userDisplayText, index };
  }

  function getGameState() {
    return { isMenu, isGameOver };
  }
  //resets all the stats and stuff for a new game
  function startGame(redo) {
    isMenu = false;
    isGameOver = false;
    startTime = Math.floor(process.uptime());
    prevTime = -1;
    curTime = -1;
    index = 0;
    userText = "";
    userDisplayText = [];
    errors = 0;
    if (redo) {
      testText = currText;
    } else testText = selectText();
    currText = testText;
  }
  function checkGameOver() {
    if (userText.length == testText.length) {
      isGameOver = true;
      endTime = curTime;
      prevWPM = wpm;
    }
  }
  function stopGame() {
    isGameOver = true;
    endTime = curTime;
    prevWPM = wpm;
  }
  return {
    getTextState,
    getTime,
    getStats,
    getGameState,
    type,
    computeStats,
    backspace,
    tick,
    startGame,
    checkGameOver,
    stopGame,
  };
}

export default master();
