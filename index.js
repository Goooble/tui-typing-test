require("dotenv").config();
console.clear();
process.title = "Typing Test";

//state
const cols = process.stdout.columns;
const rows = process.stdout.rows; //wonder what happens when rows exceed the screen
const cursor = { x: 0, y: 2 };
let user = "";
let userDisplay = [];
let index = 0;
let sample =
  "I think that by the time I turn sixty, I will probably be surrounded by children and grandchildren.";
let startTime = Math.floor(process.uptime());
let endTime = -1;
let curTime = -1;
let prevTime = -1;

let accuracy = 100;
let wpm = 0;
let errors = 0;

//stream handling
const wstream = process.stdout;
const rstream = process.stdin;
rstream.setRawMode(true);
rstream.resume();

//key press
rstream.on("data", (chunk) => {
  const key = handleInput(chunk);
  render();
});

wstream.write("\x1b[?25l");

render();
//frames
setInterval(tick, 20);

wstream.cursorTo(cursor.x, cursor.y);

function render() {
  wstream.write("\x1b[?25l");
  console.clear();
  console.log(process.title);
  console.log(
    "time: " +
      curTime +
      "  speed: " +
      wpm +
      "wpm   accuracy: " +
      accuracy +
      "%    errors: " +
      errors,
  );
  console.log("Sample text:");
  console.log(sample);
  //   console.log(userDisplay);
  cursor.x = 0;
  cursor.y = 3;
  for (let i = 0; i < userDisplay.length; i++) {
    wstream.cursorTo(cursor.x, cursor.y);
    wstream.write(userDisplay[i]);
    cursor.x++;
    if (cursor.x == cols) {
      cursor.x = 0;
      cursor.y++;
    }
  }
  //   wstream.cursorTo(0, 9);
  //   console.log(user);
  wstream.cursorTo(cursor.x, cursor.y);
  wstream.write("\x1b[?25h");
}

function handleInput(chunk) {
  let char = 2000; //for other characters that use ESC
  if (chunk.length == 1) {
    char = chunk[0];
  }
  if (char >= 32 && char <= 126) {
    // console.log(char);
    type(char);
  } else if (char == 0x7f) {
    backspace();
  } else if (char == 0x1b) {
    process.exit();
  }
}

function type(char) {
  char = String.fromCharCode(char);
  user += char;
  if (sample[index] == char) {
    userDisplay.push("\x1b[32m" + sample[index] + "\x1b[0m");
  } else {
    userDisplay.push("\x1b[31m" + sample[index] + "\x1b[0m");
    errors++;
  }
  index++;
}

function computeStats() {
  accuracy = Math.floor(((user.length - errors) / user.length) * 100);
  wpm = Math.floor((((user.length / 5) * 60) / curTime) * (accuracy / 100));
}

function backspace() {
  index--;
  if (user[index] != sample[index]) errors--;
  userDisplay.pop();
  user = user.slice(0, -1);
  console.log(user);
}

function tick() {
  curTime = Math.floor(process.uptime() - startTime);
  if (prevTime < curTime) {
    render();
    prevTime = curTime;
  }
  computeStats();
}
