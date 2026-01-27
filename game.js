import { log } from "./main.js";

function master() {
  let testText = "I think that by the";
  let userText = "";
  let userDisplayText = [];
  let index = 0;
  let startTime = Math.floor(process.uptime());
  let endTime = -1;
  let curTime = -1;
  let prevTime = -1;

  let accuracy = 100;
  let wpm = 0;
  let errors = 0;

  let isMenu = true;
  let isGameOver = false;

  function type(char) {
    char = String.fromCharCode(char);
    userText += char;
    if (testText[index] == char) {
      userDisplayText.push("\x1b[32m" + testText[index] + "\x1b[0m");
    } else {
      userDisplayText.push("\x1b[31m" + testText[index] + "\x1b[0m");
      errors++;
    }
    index++;
  }
  function backspace() {
    index--;
    if (userText[index] != testText[index]) errors--;
    userDisplayText.pop();
    userText = userText.slice(0, -1);
    console.log(userText);
  }
  function computeStats() {
    accuracy = Math.floor(((userText.length - errors) / userText.length) * 100);
    wpm = Math.floor(
      (((userText.length / 5) * 60) / curTime) * (accuracy / 100),
    );
    // log(accuracy);
  }
  function tick() {
    let change = false;
    curTime = Math.floor(process.uptime() - startTime);
    if (prevTime < curTime) {
      change = true;
      prevTime = curTime;
    }
    computeStats(); //todo
    return change;
  }
  function getStats() {
    return { accuracy, wpm, errors };
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
  function startGame() {
    isMenu = false;
  }
  function checkGameOver() {
    if (userText.length == testText) {
      isGameOver = true;
    }
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
  };
}

export default master();
